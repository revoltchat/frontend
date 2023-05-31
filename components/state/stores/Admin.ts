import { SetStoreFunction, createStore } from "solid-js/store";

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
  snapshots: Record<string, API.SnapshotWithContext>;
}

/**
 * Manage currently open tabs in admin panel
 */
export class Admin extends AbstractStore<"admin", TypeAdmin> {
  private cache: Cache;
  private setCache: SetStoreFunction<Cache>;
  private fetchingUsers: Set<string>;

  /**
   * Construct store
   * @param state State
   */
  constructor(state: State) {
    super(state, "admin");

    const [cache, setCache] = createStore({ reports: {}, snapshots: {} });
    // eslint-disable-next-line solid/reactivity
    this.cache = cache;
    this.setCache = setCache;

    this.fetchingUsers = new Set();
  }

  /**
   * Hydrate external context
   */
  hydrate(): void {
    /** nothing needs to be done */
  }

  /**
   * Generate default values
   */
  default(): TypeAdmin {
    return {
      tabs: [],
      tab: 0,
    };
  }

  /**
   * Validate the given data to see if it is compliant and return a compliant object
   */
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
        .getCurrentClient()!
        .api.get(`/safety/report/${id as ""}`)
        .then((report) => this.cacheReport(report));
    }
  }

  /**
   * Get snapshot for report
   * @param reportId Report ID
   */
  getSnapshots(reportId: string) {
    return Object.keys(this.cache.snapshots)
      .map((id) => this.cache.snapshots[id])
      .filter((snapshot) => snapshot.report_id === reportId);
  }

  /**
   * Fetch snapshots for a report
   * @param reportId Report ID
   */
  fetchSnapshots(reportId: string) {
    if (this.getSnapshots(reportId).length) return;

    const client = getController("client").getCurrentClient()!;

    client.api
      .get(`/safety/snapshot/${reportId as ""}`)
      .then((snapshots) =>
        (snapshots as never as API.SnapshotWithContext[]).forEach((snapshot) =>
          this.cacheSnapshot(snapshot)
        )
      );
  }

  /**
   * Change the active tab state
   */
  setActiveTab<T extends TabState["type"]>(
    data: Partial<TabState & { type: T }>
  ) {
    const tab = this.get().tab;
    const index = tab - DEFAULT_TAB_OFFSET_IDX;
    const entry = this.get().tabs[index];

    if (entry) {
      this.set("tabs", index, {
        ...entry,
        ...data,
      } as never);
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
   * @param absoluteIndex Absolute index
   */
  removeTab(absoluteIndex: number) {
    const index = absoluteIndex - DEFAULT_TAB_OFFSET_IDX;
    this.set("tabs", (tabs) => tabs.filter((_, idx) => index !== idx));
  }

  /**
   * Cache a given report
   * @param report Report
   */
  cacheReport(report: API.Report) {
    const client = getController("client").getCurrentClient()!;

    if (
      report.status === "Created" &&
      !this.fetchingUsers.has(report.author_id)
    ) {
      this.fetchingUsers.add(report.author_id);
      client.users.fetch(report.author_id);
    }

    this.setCache("reports", report._id, report);
  }

  /**
   * Cache a given snapshot
   * @param snapshot Snapshot
   */
  cacheSnapshot(snapshot: API.SnapshotWithContext) {
    const client = getController("client").getCurrentClient()!;

    if (snapshot._users) {
      for (const user of snapshot._users) {
        client.users.getOrCreate(user._id, user);
      }
    }

    if (snapshot._channels) {
      for (const channel of snapshot._channels) {
        client.channels.getOrCreate(channel._id, channel);
      }
    }

    if (snapshot._server) {
      client.servers.getOrCreate(snapshot._server._id, snapshot._server);
    }

    const content = snapshot.content;
    if (content._type === "Message") {
      [
        ...(content._prior_context ?? []),
        content,
        ...(content._leading_context ?? []),
      ].forEach((msg) => client.messages.getOrCreate(msg._id, msg));
    }

    this.setCache("snapshots", snapshot._id, snapshot);
  }

  /**
   * Edit a report
   * @param id Report id
   * @param data Data to apply
   */
  async editReport(id: string, data: API.DataEditReport) {
    const report = await getController("client")
      .getCurrentClient()!
      .api.patch(`/safety/reports/${id as ""}`, data);

    this.setCache("reports", id, report);
  }
}
