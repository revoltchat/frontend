import { createStore } from "solid-js/store";

export type TabState = { title: string } & (
  | {
      type: "home";
    }
  | {
      type: "reports";
    }
  | {
      type: "inspector";
      id?: string;
      typeHint?: "any" | "user" | "server" | "channel";
    }
  | {
      type: "report";
      report: any;
    }
);

export type NarrowedState<T extends TabState["type"]> = TabState & { type: T };
export type NarrowedSetter<T extends TabState["type"]> = (
  state: Partial<NarrowedState<T>>
) => void;

export type AdminStore = {
  tabs: TabState[];
};

// TODO: move into global state maybe?
export const [adminStore, setAdminStore] = createStore<AdminStore>({
  tabs: [],
});
