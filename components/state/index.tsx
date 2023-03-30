import { JSX, Show, createSignal, onMount } from "solid-js";
import { SetStoreFunction, createStore } from "solid-js/store";

import equal from "fast-deep-equal";
import localforage from "localforage";

import { AbstractStore, Store } from "./stores";
import { Admin } from "./stores/Admin";
import { Auth } from "./stores/Auth";
import { Draft } from "./stores/Draft";
import { Experiments } from "./stores/Experiments";
import { Layout } from "./stores/Layout";
import { Locale } from "./stores/Locale";
import { Ordering } from "./stores/Ordering";
import { Settings } from "./stores/Settings";

/**
 * Introduce some delay before writing state to disk
 */
const DISK_WRITE_WAIT_MS = 1200;

/**
 * Global application state
 */
export class State {
  // internal data management
  private store: Store;
  private setStore: SetStoreFunction<Store>;
  private writeQueue: Record<string, number>;

  // define all stores
  admin = new Admin(this);
  auth = new Auth(this);
  draft = new Draft(this);
  experiments = new Experiments(this);
  layout = new Layout(this);
  locale = new Locale(this);
  ordering = new Ordering(this);
  settings = new Settings(this);

  /**
   * Iterate over all available stores
   * @returns Array of stores
   */
  private iterStores() {
    return (
      Object.keys(this).filter(
        (key) => (this[key as keyof State] as any)._storeHint
      ) as (keyof Store)[]
    ).map((key) => this[key] as AbstractStore<typeof key, Store[typeof key]>);
  }

  /**
   * Generate all store defaults / initial store
   * @returns Defaults object
   */
  private defaults() {
    const defaults: Partial<Store> = {};

    for (const store of this.iterStores()) {
      defaults[store.getKey()] = store.default() as any;
    }

    return defaults;
  }

  /**
   * Construct the global application state
   */
  constructor() {
    const [store, setStore] = createStore(this.defaults() as Store);

    this.store = store;
    this.setStore = setStore;
    this.writeQueue = {};
  }

  /**
   * Write some data to the store and disk
   */
  private write: SetStoreFunction<Store> = (...args: any[]) => {
    // pass the data to the store
    (this.setStore as any)(...args);

    // resolve key
    const key = args[0];

    // remove existing queued task if it exists
    if (this.writeQueue[key]) {
      clearTimeout(this.writeQueue[key]);
    }

    // queue for writing to disk
    this.writeQueue[key] = setTimeout(() => {
      // remove from write queue
      delete this.writeQueue[key];

      // write the entire key to storage
      localforage.setItem(
        args[0],
        JSON.parse(JSON.stringify((this.store as any)[args[0]]))
      );

      if (import.meta.env.DEV) {
        console.info("Wrote state to disk.");
      }
    }, DISK_WRITE_WAIT_MS) as unknown as number;
  };

  /**
   * Write data to store / disk and then synchronise it
   */
  set: SetStoreFunction<Store> = (...args: any[]) => {
    // write to store and storage
    (this.write as any)(...args);

    // run side-effects
    if (import.meta.env.DEV) {
      console.info("[store]", this.store);
    }
  };

  /**
   * Get a store's value by its key
   * @param key Store's key
   * @returns Store's value
   */
  get<T extends keyof Store>(key: T): Store[T] {
    return this.store[key];
  }

  /**
   * Hydrate the state from disk and run side-effects
   */
  async hydrate() {
    // load all data first
    for (const store of this.iterStores()) {
      const data = await localforage.getItem(store.getKey());

      if (data) {
        // validate the incoming data
        const cleanData = store.clean(data);

        if (!equal(data, cleanData)) {
          // write back to disk if it has changed
          this.write(store.getKey(), cleanData);
        } else {
          this.setStore(store.getKey(), data);
        }
      }
    }

    // then run side-effects
    for (const store of this.iterStores()) {
      store.hydrate();
    }
  }
}

/**
 * Global application state
 */
export const state = new State();

/**
 * Component to block rendering until state is hydrated
 */
export function Hydrate(props: { children: JSX.Element }) {
  const [hydrated, setHydrated] = createSignal(false);

  onMount(() => state.hydrate().then(() => setHydrated(true)));

  return <Show when={hydrated}>{props.children}</Show>;
}
