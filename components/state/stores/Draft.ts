import { API, Message } from "revolt.js";

import { insecureUniqueId } from "@revolt/common";

import { State } from "..";

import { AbstractStore } from ".";
import { LAYOUT_SECTIONS } from "./Layout";

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
   * Add a reply to the given message
   * @param message Message
   */
  addReply(message: Message) {
    // Ignore if reply already exists
    if (
      this.getDraft(message.channel_id).replies?.find(
        (reply) => reply.id === message._id
      )
    )
      return;

    // We should not mention ourselves, otherwise use previous mention state
    const shouldMention =
      message.author_id !== message.client.user?._id &&
      this.state.layout.getSectionState(LAYOUT_SECTIONS.MENTION_REPLY);

    // Update the draft with new reply
    this.setDraft(message.channel_id, (data) => ({
      replies: [
        ...(data.replies ?? []),
        {
          id: message._id,
          mention: shouldMention,
        },
      ],
    }));
  }

  /**
   * Toggle reply mention
   *
   * This has a side-effect of updating the MENTION_REPLY section state!
   * @param channelId Channel ID
   * @param messageId Message ID
   */
  toggleReplyMention(channelId: string, messageId: string) {
    this.setDraft(channelId, (data) => ({
      replies: data.replies?.map((reply) => {
        if (reply.id === messageId) {
          // Save current mention reply state as new default
          this.state.layout.setSectionState(
            LAYOUT_SECTIONS.MENTION_REPLY,
            !reply.mention
          );

          return { ...reply, mention: !reply.mention };
        }

        return reply;
      }),
    }));
  }

  /**
   * Remove a reply by message ID from a channel draft
   * @param channelId Channel ID
   * @param messageId Message ID
   */
  removeReply(channelId: string, messageId: string) {
    this.setDraft(channelId, (data) => ({
      replies: data.replies?.filter((reply) => reply.id !== messageId),
    }));
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
