import { API } from "revolt.js";

import { insecureUniqueId } from "@revolt/common";

import { State } from "..";

import { AbstractStore } from ".";

export interface DraftData {
  /**
   * Message content
   */
  content?: string;

  /**
   * Message IDs being replied to
   */
  replies?: API.Reply[];

  /**
   * IDs of cached files
   */
  files?: string[];
}

export type TypeDraft = {
  /**
   * All active message drafts
   */
  drafts: Record<string, DraftData>;
};

export class Draft extends AbstractStore<"draft", TypeDraft> {
  private fileCache: Record<string, File>;

  constructor(state: State) {
    super(state, "draft");
    this.fileCache = {};
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
    const files = this.getDraft(channelId)?.files ?? [];
    for (const file of files) {
      delete this.fileCache[file];
    }

    this.setDraft(channelId, {
      content: "",
      replies: [],
      files: [],
    });
  }

  /**
   * Reset and clear all drafts.
   */
  reset() {
    this.set("drafts", {});
  }

  /**
   * Add a file to a draft
   * @param channelId Channel ID
   * @param file File to add
   */
  addFile(channelId: string, file: File) {
    const id = insecureUniqueId();
    this.fileCache[id] = file;
    this.setDraft(channelId, (data) => ({
      files: [...(data.files ?? []), id],
    }));
  }

  /**
   * Remove a file from a draft
   * @param channelId Channel ID
   * @param fileId File ID
   */
  removeFile(channelId: string, fileId: string) {
    delete this.fileCache[fileId];
    this.setDraft(channelId, (data) => ({
      files: data.files?.filter((entry) => entry !== fileId),
    }));
  }

  /**
   * Get cache File by its ID
   * @param fileId File ID
   * @returns Cached File
   */
  getFile(fileId: string) {
    return this.fileCache[fileId];
  }
}
