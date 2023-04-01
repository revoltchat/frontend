import { getController } from "@revolt/common";

import { State } from "..";

import { AbstractStore } from ".";

export interface TypeOrdering {
  /**
   * Ordered list of server IDs
   */
  servers: string[];
}

/**
 * Handles ordering of items in the app interface.
 */
export class Ordering extends AbstractStore<"ordering", TypeOrdering> {
  constructor(state: State) {
    super(state, "ordering");
    this.setServerOrder = this.setServerOrder.bind(this);
  }

  hydrate(): void {
    /** nothing needs to be done */
  }

  default(): TypeOrdering {
    return {
      servers: [],
    };
  }

  clean(input: Partial<TypeOrdering>): TypeOrdering {
    const ordering: TypeOrdering = this.default();

    if (Array.isArray(input.servers)) {
      for (const serverId of input.servers) {
        if (typeof serverId === "string") {
          ordering.servers.push(serverId);
        }
      }
    }

    return ordering;
  }

  /**
   * All known servers with ordering applied
   * @returns List of Server objects
   */
  get orderedServers() {
    const client = getController("client").getReadyClient();
    const known = new Set(client?.servers.keys() ?? []);
    const ordered = [...this.get().servers];

    const out = [];
    for (const id of ordered) {
      if (known.delete(id)) {
        out.push(client!.servers.get(id)!);
      }
    }

    for (const id of known) {
      out.push(client!.servers.get(id)!);
    }

    return out;
  }

  /**
   * Set server ordering
   * @param ids List of IDs
   */
  setServerOrder(ids: string[]) {
    this.set("servers", ids);
  }

  /**
   * All known active DM conversations ordered by last updated
   * @returns List of Channel objects
   */
  get orderedConversations() {
    const client = getController("client").getReadyClient();
    const arr = [...(client?.channels.values() ?? [])].filter(
      (channel) =>
        (channel.channel_type === "DirectMessage" && channel.active) ||
        channel.channel_type === "Group"
    );

    arr.sort((a, b) => b.updatedAt - a.updatedAt);
    return arr;
  }
}
