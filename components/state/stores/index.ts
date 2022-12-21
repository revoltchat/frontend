import { SetStoreFunction } from "solid-js/store";
import { State } from "..";

import { TypeLocale } from "./Locale";

export type Store = {
  locale: TypeLocale;
};

export abstract class AbstractStore<T extends keyof Store, D> {
  private readonly _storeHint = true;
  private readonly state: State;
  private readonly key: T;

  constructor(state: State, key: T) {
    this.state = state;
    this.key = key;
  }

  getKey(): T {
    return this.key;
  }

  protected set: SetStoreFunction<Store[T]> = (...args: any[]) => {
    (this.state.set as any)(this.key, ...args);
  };

  protected get() {
    return this.state.get(this.key);
  }

  abstract hydrate(): void;

  abstract default(): D;
}
