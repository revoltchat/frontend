import { SetStoreFunction, createStore } from "solid-js/store";

import { runInAction } from "mobx";
import { API } from "revolt.js";

import { getController } from "@revolt/common";

import { State } from "..";

import { AbstractStore } from ".";

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
      typeHint?: "any" | "user" | "server" | "channel" | "message";
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
  reports: Record<string, API.Report | false>;
  snapshots: Record<string, API.SnapshotWithContext | false>;
}

export class Admin extends AbstractStore<"admin", TypeAdmin> {
  private cache: Cache;
  private setCache: SetStoreFunction<Cache>;
  private fetchingUsers: Set<string>;

  constructor(state: State) {
    super(state, "admin");

    const [cache, setCache] = createStore({ reports: {}, snapshots: {} });
    this.cache = cache;
    this.setCache = setCache;

    this.fetchingUsers = new Set();
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

    if (typeof report === "undefined") {
      this.setCache("reports", id, false);

      getController("client")
        .getReadyClient()!
        .api.get(`/safety/report/${id as ""}`)
        .then((report) => this.cacheReport(report));
    }
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

    if (typeof snapshot === "undefined") {
      this.setCache("snapshots", report_id, false);

      const client = getController("client").getReadyClient()!;

      client.api
        .get(`/safety/snapshot/${report_id as ""}`)
        .then((snapshot) => this.cacheSnapshot(snapshot));
    }
  }

  /**
   * Change the active tab state
   */
  setActiveTab<T extends TabState["type"]>(
    data: Partial<TabState & { type: T }>
  ) {
    let tab = this.get().tab;
    let index = tab - DEFAULT_TAB_OFFSET_IDX;
    let entry = this.get().tabs[index];
    if (entry) {
      this.set("tabs", index, {
        ...entry,
        ...data,
      } as any);
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
    runInAction(() => {
      const client = getController("client").getReadyClient()!;

      if (
        report.status === "Created" &&
        !this.fetchingUsers.has(report.author_id)
      ) {
        this.fetchingUsers.add(report.author_id);
        client.users.fetch(report.author_id);
      }
    });

    this.setCache("reports", report._id, report);
  }

  /**
   * Cache a given snapshot
   * @param snapshot Snapshot
   */
  cacheSnapshot(snapshot: API.SnapshotWithContext) {
    runInAction(() => {
      const client = getController("client").getReadyClient()!;

      if (snapshot._users) {
        for (const user of snapshot._users) {
          client.users.createObj(user);
        }
      }

      if (snapshot._channels) {
        for (const channel of snapshot._channels) {
          client.channels.createObj(channel);
        }
      }

      if (snapshot._server) {
        client.servers.createObj(snapshot._server);
      }

      const content = snapshot.content;
      if (content._type === "Message") {
        [
          ...(content._prior_context ?? []),
          content,
          ...(content._leading_context ?? []),
        ].forEach((msg) => client.messages.createObj(msg));
      }
    });

    this.setCache("snapshots", snapshot.report_id, snapshot);
  }

  /**
   * Edit a report
   * @param id Report id
   * @param data Data to apply
   */
  async editReport(id: string, data: API.DataEditReport) {
    const report = await getController("client")
      .getReadyClient()!
      .api.patch(`/safety/reports/${id as ""}`, data);

    this.setCache("reports", id, report);
  }
}
