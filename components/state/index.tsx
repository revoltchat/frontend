import { createStore, SetStoreFunction } from "solid-js/store";
import { createSignal, JSX, onMount, Show } from "solid-js";
import localforage from "localforage";

import { Locale } from "./stores/Locale";
import { AbstractStore, Store } from "./stores";

export class State {
  private store: Store;
  private setStore: SetStoreFunction<Store>;

  locale: Locale = new Locale(this);

  private iterStores() {
    return (
      Object.keys(this).filter(
        (key) => (this[key as keyof State] as any)._storeHint
      ) as (keyof Store)[]
    ).map((key) => this[key] as AbstractStore<typeof key, Store[typeof key]>);
  }

  private defaults() {
    const defaults: Partial<Store> = {};

    for (const store of this.iterStores()) {
      defaults[store.getKey()] = store.default();
    }

    return defaults;
  }

  constructor() {
    const [store, setStore] = createStore(this.defaults() as Store);

    this.store = store;
    this.setStore = setStore;
  }

  private write: SetStoreFunction<Store> = (...args: any[]) => {
    // pass the data to the store
    (this.setStore as any)(...args);

    // write the entire key to storage
    localforage.setItem(
      args[0],
      JSON.parse(JSON.stringify((this.store as any)[args[0]]))
    );
  };

  set: SetStoreFunction<Store> = (...args: any[]) => {
    // write to store and storage
    (this.write as any)(...args);

    // run side-effects
    console.info(this.store);
  };

  get<T extends keyof Store>(key: T): Store[T] {
    return this.store[key];
  }

  async hydrate() {
    // load all data first
    for (const store of this.iterStores()) {
      const data = (await localforage.getItem("locale")) as Store["locale"];

      if (data) {
        this.setStore(store.getKey(), data);
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

export function Hydrate(props: { children: JSX.Element }) {
  const [hydrated, setHydrated] = createSignal(false);

  onMount(() => state.hydrate().then(() => setHydrated(true)));

  return <Show when={hydrated}>{props.children}</Show>;
}
