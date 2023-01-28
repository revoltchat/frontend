import { State } from "..";
import { AbstractStore } from ".";
import { API } from "revolt.js";

export interface DraftData {
  /**
   * Message content
   */
  content?: string;

  /**
   * Message IDs being replied to
   */
  replies?: API.Reply[];
}

export type TypeDraft = {
  /**
   * All active message drafts
   */
  drafts: Record<string, DraftData>;
};

export class Draft extends AbstractStore<"draft", TypeDraft> {
  constructor(state: State) {
    super(state, "draft");
  }

  hydrate(): void {}

  default(): TypeDraft {
    return {
      drafts: {},
    };
  }

  clean(input: Partial<TypeDraft>): TypeDraft {
    let drafts: TypeDraft["drafts"] = {};

    const messageDrafts = input.drafts;
    if (messageDrafts) {
      for (const channelId of Object.keys(messageDrafts)) {
        const entry = messageDrafts?.[channelId];
        const draft: DraftData = {};

        if (typeof entry?.content === "string" && entry.content) {
          draft.content = entry.content;
        }

        if (
          Array.isArray(entry?.replies) &&
          entry!.replies.length &&
          !entry!.replies.find(
            (x) =>
              typeof x !== "object" ||
              typeof x.id !== "string" ||
              typeof x.mention !== "boolean"
          )
        ) {
          draft.replies = entry!.replies;
        }

        if (Object.keys(draft).length) {
          drafts[channelId] = draft;
        }
      }
    }

    return {
      drafts,
    };
  }

  /**
   * Get draft for a channel.
   * @param channelId Channel ID
   */
  getDraft(channelId: string): DraftData {
    return this.get().drafts[channelId] ?? {};
  }

  /**
   * Check whether a channel has a draft.
   * @param channelId Channel ID
   */
  hasDraft(channelId: string) {
    const entry = this.get().drafts[channelId];
    return entry && entry.content!.length > 0;
  }

  /**
   * Set draft for a channel.
   * @param channelId Channel ID
   * @param data Draft content
   */
  setDraft(
    channelId: string,
    data?: DraftData | ((data: DraftData) => DraftData)
  ) {
    if (typeof data === "function") {
      data = data(this.getDraft(channelId));
    }

    if (typeof data === "undefined") {
      return this.clearDraft(channelId);
    }

    this.set("drafts", channelId, data);
  }

  /**
   * Clear draft from a channel.
   * @param channelId Channel ID
   */
  clearDraft(channelId: string) {
    this.setDraft(channelId, {
      content: "",
      replies: [],
    });
  }

  /**
   * Reset and clear all drafts.
   */
  reset() {
    this.set("drafts", {});
  }
}
