import { State } from "..";
import { AbstractStore } from ".";

interface DraftData {
  /**
   * Message content
   */
  content: string;
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

    for (const channelId of Object.keys(input)) {
      const entry = input.drafts?.[channelId];
      if (typeof entry?.content === "string") {
        drafts[channelId] = {
          content: entry!.content,
        };
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
  getDraft(channelId: string) {
    return this.get().drafts[channelId];
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
  setDraft(channelId: string, data?: DraftData) {
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
    const { [channelId]: _, ...drafts } = this.get().drafts;
    this.set("drafts", drafts);
  }

  /**
   * Reset and clear all drafts.
   */
  reset() {
    this.set("drafts", {});
  }
}
