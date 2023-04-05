import {
  BiRegularPlus,
  BiSolidFileGif,
  BiSolidHappyBeaming,
  BiSolidSend,
} from "solid-icons/bi";
import { For, Match, Show, Switch, onCleanup, onMount } from "solid-js";

import { API, Channel } from "revolt.js";

import { useClient } from "@revolt/client";
import { debounce } from "@revolt/common";
import { useTranslation } from "@revolt/i18n";
import { state } from "@revolt/state";
import {
  CompositionPicker,
  FileCarousel,
  FileDropAnywhereCollector,
  FilePasteCollector,
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
  const t = useTranslation();

  /**
   * Reference to the message input box
   */
  let ref: HTMLTextAreaElement | undefined;

  // Resolve the client and current draft
  const client = useClient();
  const draft = () => state.draft.getDraft(props.channel._id);

  /**
   * Keep track of last time we sent a typing packet
   */
  let isTyping: number | undefined = undefined;

  /**
   * Send typing packet
   */
  function startTyping() {
    if (typeof isTyping === "number" && +new Date() < isTyping) return;

    const ws = client.websocket;
    if (ws.connected) {
      isTyping = +new Date() + 2500;
      ws.send({
        type: "BeginTyping",
        channel: props.channel._id,
      });
    }
  }

  /**
   * Send stop typing packet
   */
  function stopTyping() {
    if (isTyping) {
      const ws = client.websocket;
      if (ws.connected) {
        isTyping = undefined;
        ws.send({
          type: "EndTyping",
          channel: props.channel._id,
        });
      }
    }
  }

  /**
   * Stop typing after some time
   */
  const delayedStopTyping = debounce(stopTyping, 1000);

  /**
   * Send a message using the current draft
   * @param useContent Content to send
   */
  async function sendMessage(useContent?: unknown) {
    if (typeof useContent === "string") {
      return props.channel.sendMessage(useContent);
    }

    const { content, replies, files } = state.draft.popDraft(props.channel._id);

    // Construct message object
    const attachments: string[] = [];
    const data: API.DataMessageSend = {
      content,
      replies,
      attachments,
    };

    // Add any files if attached
    if (files?.length) {
      for (const file of files) {
        // Prepare for upload
        const body = new FormData();
        body.append("file", file);

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

    // TODO: fix bug with backend
    if (!attachments.length) {
      delete data.attachments;
    }

    // Send the message and clear the draft
    props.channel.sendMessage(data);
  }

  /**
   * Shorthand for updating the draft
   */
  function setContent(content: string) {
    state.draft.setDraft(props.channel._id, { content });
    startTyping();
  }

  /**
   * Handle key presses in input box
   * @param event Keyboard Event
   */
  function onKeyDownMessageBox(event: KeyboardEvent) {
    if (event.key === "Enter" && !event.shiftKey /*&& props.ref*/) {
      event.preventDefault();
      sendMessage();
      stopTyping();
    } else {
      delayedStopTyping();
    }
  }

  /**
   * Handle ESC key being pressed
   * @param event Keyboard Event
   */
  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      if (state.draft.popFromDraft(props.channel._id)) {
        event.preventDefault();
      }
    } else if (!(event.target instanceof HTMLInputElement)) {
      ref?.focus();
    }
  }

  // Bind onKeyDown to the document
  onMount(() => document.addEventListener("keydown", onKeyDown));
  onCleanup(() => document.removeEventListener("keydown", onKeyDown));

  /**
   * Handle files being added to the draft.
   * @param files List of files
   */
  function onFiles(files: File[]) {
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
  }

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
      onFiles([...files]);
    });

    // iOS requires us to append the file input
    // to DOM to allow us to add any images
    document.body.appendChild(input);
    input.click();
  }

  /**
   * Remove a file by its ID
   * @param fileId File ID
   */
  function removeFile(fileId: string) {
    state.draft.removeFile(props.channel._id, fileId);
  }

  return (
    <>
      <FileCarousel
        files={draft().files ?? []}
        getFile={state.draft.getFile}
        addFile={addFile}
        removeFile={removeFile}
      />
      <For each={draft().replies ?? []}>
        {(reply) => {
          const message = client.messages.get(reply.id);
          return (
            <MessageReplyPreview
              message={message}
              mention={reply.mention}
              toggle={() =>
                state.draft.toggleReplyMention(props.channel._id, reply.id)
              }
              dismiss={() =>
                state.draft.removeReply(props.channel._id, reply.id)
              }
              self={message?.author_id === client.user?._id}
            />
          );
        }}
      </For>
      <MessageBox
        ref={ref}
        content={() => draft()?.content ?? ""}
        setContent={setContent}
        onKeyDown={onKeyDownMessageBox}
        actionsStart={
          <Switch fallback={<InlineIcon size="short" />}>
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
          <CompositionPicker sendGIFMessage={sendMessage}>
            {(triggerProps) => (
              <>
                <Show when={state.experiments.isEnabled("gif_picker")}>
                  <InlineIcon size="normal">
                    <IconButton onClick={triggerProps.onClickGif}>
                      <BiSolidFileGif size={24} />
                    </IconButton>
                  </InlineIcon>
                </Show>
                <Show when={state.experiments.isEnabled("emoji_picker")}>
                  <InlineIcon size="normal">
                    <IconButton onClick={triggerProps.onClickEmoji}>
                      <BiSolidHappyBeaming size={24} />
                    </IconButton>
                  </InlineIcon>
                </Show>
                <Show
                  when={state.settings.getValue("appearance:show_send_button")}
                >
                  <InlineIcon size="normal">
                    <IconButton>
                      <BiSolidSend size={24} onClick={sendMessage} />
                    </IconButton>
                  </InlineIcon>
                </Show>

                <div ref={triggerProps.ref} />
              </>
            )}
          </CompositionPicker>
        }
        placeholder={
          props.channel.channel_type === "SavedMessages"
            ? t("app.main.channel.message_saved")
            : props.channel.channel_type === "DirectMessage"
            ? t("app.main.channel.message_who", {
                person: props.channel.recipient?.username as string,
              })
            : t("app.main.channel.message_where", {
                channel_name: props.channel.name as string,
              })
        }
        sendingAllowed={props.channel.havePermission("SendMessage")}
      />
      <FilePasteCollector onFiles={onFiles} />
      <FileDropAnywhereCollector onFiles={onFiles} />
    </>
  );
}
