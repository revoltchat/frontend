import { SetStoreFunction } from "solid-js/store";
import { State } from "..";

import { TypeLocale } from "./Locale";

export type Store = {
  locale: TypeLocale;
};

/**
 * Abstract store implementation
 */
export abstract class AbstractStore<T extends keyof Store, D> {
  /**
   * Marker used to determine whether this is a store
   */
  private readonly _storeHint = true;

  /**
   * Reference to the current state
   */
  private readonly state: State;

  /**
   * This store's key
   */
  private readonly key: T;

  /**
   * Construct a new store
   * @param state Reference to current state
   * @param key This store's key
   */
  constructor(state: State, key: T) {
    this.state = state;
    this.key = key;
  }

  /**
   * Get this store's key
   * @returns Key
   */
  getKey(): T {
    return this.key;
  }

  /**
   * Set some value in this store
   */
  protected set: SetStoreFunction<Store[T]> = (...args: any[]) => {
    (this.state.set as any)(this.key, ...args);
  };

  /**
   * Get this store's value
   */
  protected get() {
    return this.state.get(this.key);
  }

  /**
   * Hydrate external context
   */
  abstract hydrate(): void;

  /**
   * Generate default values
   */
  abstract default(): D;
}
