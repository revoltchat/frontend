import {
  BiRegularBlock,
  BiRegularPlus,
  BiSolidFileGif,
  BiSolidHappyBeaming,
  BiSolidSend,
} from "solid-icons/bi";
import { For, Match, Show, Switch, onCleanup } from "solid-js";

import { API, Channel } from "revolt.js";

import { useClient } from "@revolt/client";
import { state } from "@revolt/state";
import type { DraftData } from "@revolt/state/stores/Draft";
import {
  IconButton,
  InlineIcon,
  MessageBox,
  MessageReplyPreview,
} from "@revolt/ui";

interface Props {
  channel: Channel;
}

/**
 * Message composition engine
 */
export function MessageComposition(props: Props) {
  /**
   * Reference to the message input box
   */
  let ref: HTMLTextAreaElement | undefined;

  // Resolve the client and current draft
  const client = useClient();
  const draft = () => state.draft.getDraft(props.channel._id);

  /**
   * Send a message using the current draft
   */
  async function sendMessage() {
    const { content, replies, files } = draft();

    // Construct message object
    const attachments: string[] = [];
    const data: API.DataMessageSend = {
      content,
      replies,
      attachments,
    };

    // Add any files if attached
    if (files?.length) {
      for (const fileId of files) {
        // Prepare for upload
        const body = new FormData();
        body.append("file", state.draft.getFile(fileId));

        // Upload to Autumn
        attachments.push(
          await fetch(
            `${client.configuration?.features.autumn.url}/attachments`,
            {
              method: "POST",
              body,
            }
          )
            .then((res) => res.json())
            .then((res) => res.id)
        );
      }
    }

    // FIXME: bug with backend
    if (!attachments.length) {
      delete data.attachments;
    }

    // Send the message and clear the draft
    props.channel.sendMessage(data);
    state.draft.clearDraft(props.channel._id); // TODO: popDraft to move to queue (w/ file IDs)
  }

  /**
   * Shorthand for updating the draft
   */
  function set(data: DraftData | ((data: DraftData) => DraftData)) {
    state.draft.setDraft(props.channel._id, data);
  }

  /**
   * Handle ESC key being pressed
   * @param ev Keyboard Event
   */
  function onKeyDown(ev: KeyboardEvent) {
    if (ev.key === "Escape") {
      if (draft().replies?.length) {
        ev.preventDefault();

        set((data) => ({
          replies: data.replies!.slice(0, data.replies!.length - 1),
        }));
      }
    } else {
      ref?.focus();
    }
  }

  // Bind onKeyDown to the document
  document.addEventListener("keydown", onKeyDown);
  onCleanup(() => document.removeEventListener("keydown", onKeyDown));

  /**
   * Add a file to the message
   */
  function addFile() {
    const input = document.createElement("input");
    input.accept = "*";
    input.type = "file";
    input.multiple = true;
    input.style.display = "none";

    input.addEventListener("change", async (e) => {
      // Get all attached files
      const files = (e.currentTarget as HTMLInputElement)?.files;

      // Remove element from DOM
      input.remove();

      // Skip execution if no files specified
      if (!files) return;

      for (const file of files) {
        if (file.size > 20_000_000) {
          alert("file too large");
        }
      }

      const validFiles = Array.from(files).filter(
        (file) => file.size <= 20_000_000
      );

      for (const file of validFiles) {
        state.draft.addFile(props.channel._id, file);
      }
    });

    // iOS requires us to append the file input
    // to DOM to allow us to add any images
    document.body.appendChild(input);
    input.click();
  }

  return (
    <>
      <For each={draft().files ?? []}>{(file) => <span>a file</span>}</For>
      <For each={draft().replies ?? []}>
        {(reply, index) => {
          const message = client.messages.get(reply.id);
          return (
            <MessageReplyPreview
              message={message}
              mention={reply.mention}
              toggle={() =>
                set({
                  replies: draft().replies!.map((reply, idx) =>
                    index() === idx
                      ? { ...reply, mention: !reply.mention }
                      : reply
                  ),
                })
              }
              dismiss={() =>
                set({
                  replies: draft().replies!.filter((_, idx) => index() !== idx),
                })
              }
              self={message?.author_id === client.user?._id}
            />
          );
        }}
      </For>
      <MessageBox
        ref={ref}
        content={() => draft()?.content ?? ""}
        setContent={(content) => set({ content })}
        sendMessage={sendMessage}
        actionsStart={
          <Switch fallback={<InlineIcon size="short" />}>
            <Match when={!props.channel.havePermission("SendMessage")}>
              <InlineIcon size="wide">
                <BiRegularBlock size={24} />
              </InlineIcon>
            </Match>
            <Match
              when={
                props.channel.havePermission("UploadFiles") &&
                state.experiments.isEnabled("file_uploads")
              }
            >
              <InlineIcon size="wide">
                <IconButton onClick={addFile}>
                  <BiRegularPlus size={24} />
                </IconButton>
              </InlineIcon>
            </Match>
          </Switch>
        }
        actionsEnd={
          <>
            <InlineIcon size="normal">
              <IconButton>
                <BiSolidFileGif size={24} />
              </IconButton>
            </InlineIcon>
            <InlineIcon size="normal">
              <IconButton>
                <BiSolidHappyBeaming size={24} />
              </IconButton>
            </InlineIcon>
            <Show when={state.settings.getValue("appearance:show_send_button")}>
              <InlineIcon size="normal">
                <IconButton>
                  <BiSolidSend size={24} onClick={sendMessage} />
                </IconButton>
              </InlineIcon>
            </Show>
          </>
        }
        placeholder={
          props.channel.channel_type === "SavedMessages"
            ? "Send to notes"
            : `Message ${
                props.channel.name ?? props.channel.recipient?.username
              }`
        }
        sendingAllowed={props.channel.havePermission("SendMessage")}
      />
    </>
  );
}
