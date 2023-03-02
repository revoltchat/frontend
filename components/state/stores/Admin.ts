import { State } from "..";
import { API } from "revolt.js";
import { AbstractStore } from ".";
import { createStore, SetStoreFunction } from "solid-js/store";

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
      id: string;
    }
);

export interface TypeAdmin {
  /**
   * Currently open tabs
   */
  tabs: TabState[];

  /**
   * Currently selected tab
   */
  tab: number;
}

/**
 * Number of hard-coded permanent admin tabs
 */
export const DEFAULT_TAB_OFFSET_IDX = 2;

/**
 * Admin object cache
 */
interface Cache {
  reports: Record<string, API.Report>;
  snapshots: Record<string, API.SnapshotWithContext>;
}

export class Admin extends AbstractStore<"admin", TypeAdmin> {
  private cache: Cache;
  private setCache: SetStoreFunction<Cache>;

  constructor(state: State) {
    super(state, "admin");

    const [cache, setCache] = createStore({ reports: {}, snapshots: {} });
    this.cache = cache;
    this.setCache = setCache;
  }

  hydrate(): void {}

  default(): TypeAdmin {
    return {
      tabs: [],
      tab: 0,
    };
  }

  clean(input: Partial<TypeAdmin>): TypeAdmin {
    // TODO: write clean function
    return input as TypeAdmin;
  }

  /**
   * Get the active tab index
   * @returns Index
   */
  getActiveTabIndex() {
    return this.get().tab;
  }

  /**
   * Get the active tab state
   * @returns Tab state
   */
  getActiveTab<T extends TabState["type"]>():
    | (TabState & { type: T })
    | undefined {
    return this.get().tabs[
      this.getActiveTabIndex() - DEFAULT_TAB_OFFSET_IDX
    ] as TabState & { type: T };
  }

  /**
   * Get the list of open tabs
   * @returns List of tabs
   */
  getTabs() {
    return this.get().tabs;
  }

  /**
   * Get report by id
   *
   * Will be fetched in background if not yet available
   * @param id Report id
   */
  getReport(id: string) {
    const report = this.cache.reports[id];
    if (report) return report;

    // TODO: add report fetch route
  }

  /**
   * Get snapshot by id
   *
   * Will be fetched in background if not yet available
   * @param report_id Report id
   */
  getSnapshot(report_id: string) {
    const snapshot = this.cache.snapshots[report_id];
    if (snapshot) return snapshot;

    // TODO: need common
    /*clientController
      .getReadyClient()!
      .api.get(`/safety/snapshot/${report_id as ""}`)
      .then((snapshot) => this.setCache("snapshots", report_id, snapshot));*/
  }

  /**
   * Change the active tab state
   */
  setActiveTab<T extends TabState["type"]>(
    ...data: Parameters<SetStoreFunction<TabState & { type: T }>>
  ) {
    let tab = this.get().tab;
    if (tab) {
      (this.set as any)("tabs", tab, ...data);
    }
  }

  /**
   * Change the active tab index
   */
  setActiveTabIndex(idx: number) {
    this.set("tab", idx);
  }

  /**
   * Add a new tab
   * @param tab Tab state
   * @param switchTo Whether to switch to this tab
   */
  addTab(tab: TabState, switchTo?: boolean) {
    this.set("tabs", (tabs) => [...tabs, tab]);

    if (switchTo) {
      this.set("tab", this.get().tabs.length + DEFAULT_TAB_OFFSET_IDX);
    }
  }

  /**
   * Remove tab at index
   * @param idx Absolute index
   */
  removeTab(idx: number) {
    const index = idx - DEFAULT_TAB_OFFSET_IDX;
    this.set("tabs", (tabs) => tabs.filter((_, idx) => index !== idx));
  }

  /**
   * Cache a given report
   * @param report Report
   */
  cacheReport(report: API.Report) {
    this.setCache("reports", report._id, report);
  }

  /**
   * Cache a given snapshot
   * @param snapshot Snapshot
   */
  cacheSnapshot(snapshot: API.SnapshotWithContext) {
    this.setCache("snapshots", snapshot.report_id, snapshot);
  }
}
