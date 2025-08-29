import { BiRegularPlus, BiSolidFileGif } from "solid-icons/bi";
import {
  For,
  Match,
  Show,
  Switch,
  createEffect,
  createSignal,
  on,
} from "solid-js";

import { useLingui } from "@lingui-solid/solid/macro";
import { Node } from "prosemirror-model";
import { Channel } from "revolt.js";

import { useClient } from "@revolt/client";
import { debounce } from "@revolt/common";
import { Keybind, KeybindAction, createKeybind } from "@revolt/keybinds";
import { useState } from "@revolt/state";
import {
  CompositionMediaPicker,
  FileCarousel,
  FileDropAnywhereCollector,
  FilePasteCollector,
  IconButton,
  MessageBox,
  MessageReplyPreview,
  Row,
} from "@revolt/ui";

import MdEmoji from "@material-design-icons/svg/filled/emoji_emotions.svg?component-solid";
import MdSend from "@material-design-icons/svg/filled/send.svg?component-solid";

interface Props {
  /**
   * Channel to compose for
   */
  channel: Channel;

  /**
   * Notify parent component when a message is sent
   */
  onMessageSend?: () => void;
}

/**
 * Message composition engine
 */
export function MessageComposition(props: Props) {
  const state = useState();
  const { t } = useLingui();
  const client = useClient();

  /**
   * Reference to the message input box
   */
  let ref: HTMLTextAreaElement | undefined;

  createKeybind(KeybindAction.CHAT_JUMP_END, () => ref?.focus());
  createKeybind(KeybindAction.CHAT_FOCUS_COMPOSITION, () => ref?.focus());

  /**
   * Get the draft for the current channel
   * @returns Draft
   */
  function draft() {
    return state.draft.getDraft(props.channel.id);
  }

  // TEMP
  function currentValue() {
    return draft()?.content ?? "";
  }

  const [initialValue, setInitialValue] = createSignal([
    currentValue(),
  ] as const);

  const [nodeReplacement, setNodeReplacement] = createSignal<Node>();

  createEffect(
    on(
      () => props.channel,
      () => setInitialValue([currentValue()]),
      { defer: true },
    ),
  );

  createEffect(
    on(
      () => currentValue(),
      (value) => {
        if (value === "") {
          setInitialValue([""]);
        }
      },
      { defer: true },
    ),
  );
  // END TEMP

  /**
   * Keep track of last time we sent a typing packet
   */
  let isTyping: number | undefined = undefined;

  /**
   * Send typing packet
   */
  function startTyping() {
    if (typeof isTyping === "number" && +new Date() < isTyping) return;

    const ws = client()!.events;
    if (ws.state() === 2) {
      isTyping = +new Date() + 2500;
      ws.send({
        type: "BeginTyping",
        channel: props.channel.id,
      });
    }
  }

  /**
   * Send stop typing packet
   */
  function stopTyping() {
    if (isTyping) {
      const ws = client()!.events;
      if (ws.state() === 2) {
        isTyping = undefined;
        ws.send({
          type: "EndTyping",
          channel: props.channel.id,
        });
      }
    }
  }

  /**
   * Stop typing after some time
   */
  const delayedStopTyping = debounce(stopTyping, 1000); // eslint-disable-line solid/reactivity

  /**
   * Send a message using the current draft
   * @param useContent Content to send
   */
  async function sendMessage(useContent?: unknown) {
    stopTyping();
    props.onMessageSend?.();

    if (typeof useContent === "string") {
      return props.channel.sendMessage(useContent);
    }

    state.draft.sendDraft(client(), props.channel);
  }

  /**
   * Shorthand for updating the draft
   */
  function setContent(content: string) {
    state.draft.setDraft(props.channel.id, { content });
    startTyping();
  }

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
      (file) => file.size <= 20_000_000,
    );

    for (const file of validFiles) {
      state.draft.addFile(props.channel.id, file);
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
    state.draft.removeFile(props.channel.id, fileId);
  }

  return (
    <>
      <Show when={state.draft.hasAdditionalElements(props.channel.id)}>
        <Keybind
          keybind={KeybindAction.CHAT_REMOVE_COMPOSITION_ELEMENT}
          onPressed={() => state.draft.popFromDraft(props.channel.id)}
        />
      </Show>
      <FileCarousel
        files={draft().files ?? []}
        getFile={state.draft.getFile}
        addFile={addFile}
        removeFile={removeFile}
      />
      <For each={draft().replies ?? []}>
        {(reply) => {
          const message = client()!.messages.get(reply.id);

          /**
           * Toggle mention on reply
           */
          function toggle() {
            state.draft.toggleReplyMention(props.channel.id, reply.id);
          }

          /**
           * Dismiss a reply
           */
          function dismiss() {
            state.draft.removeReply(props.channel.id, reply.id);
          }

          return (
            <MessageReplyPreview
              message={message}
              mention={reply.mention}
              toggle={toggle}
              dismiss={dismiss}
              self={message?.authorId === client()!.user!.id}
            />
          );
        }}
      </For>
      <Row>
        <MessageBox
          ref={ref}
          initialValue={initialValue()}
          nodeReplacement={nodeReplacement()}
          onSendMessage={sendMessage}
          onTyping={delayedStopTyping}
          onEditLastMessage={() => state.draft.setEditingMessage(true)}
          content={draft()?.content ?? ""}
          setContent={setContent}
          actionsStart={
            <Switch fallback={<MessageBox.InlineIcon size="short" />}>
              <Match when={props.channel.havePermission("UploadFiles")}>
                <MessageBox.InlineIcon size="wide">
                  <IconButton onPress={addFile}>
                    <BiRegularPlus size={24} />
                  </IconButton>
                </MessageBox.InlineIcon>
              </Match>
            </Switch>
          }
          actionsEnd={
            <CompositionMediaPicker
              onMessage={sendMessage}
              onTextReplacement={setNodeReplacement}
            >
              {(triggerProps) => (
                <>
                  <Show when={state.experiments.isEnabled("gif_picker")}>
                    <MessageBox.InlineIcon size="normal">
                      <IconButton onPress={triggerProps.onClickGif}>
                        <BiSolidFileGif size={24} />
                      </IconButton>
                    </MessageBox.InlineIcon>
                  </Show>
                  <Show when={state.experiments.isEnabled("emoji_picker")}>
                    <MessageBox.InlineIcon size="normal">
                      <IconButton onPress={triggerProps.onClickEmoji}>
                        <MdEmoji />
                      </IconButton>
                    </MessageBox.InlineIcon>
                  </Show>

                  <div ref={triggerProps.ref} />
                </>
              )}
            </CompositionMediaPicker>
          }
          placeholder={
            props.channel.type === "SavedMessages"
              ? t`Save to your notes`
              : props.channel.type === "DirectMessage"
                ? t`Message ${props.channel.recipient?.username}`
                : t`Message ${props.channel.name}`
          }
          sendingAllowed={props.channel.havePermission("SendMessage")}
          autoCompleteSearchSpace={
            props.channel.server
              ? {
                  members: client().serverMembers.filter(
                    (member) => member.id.server === props.channel.serverId,
                  ),
                  channels: props.channel.server.channels,
                  roles: [...props.channel.server.roles.values()],
                }
              : props.channel.type === "Group"
                ? { users: props.channel.recipients, channels: [] }
                : { channels: [] }
          }
          updateDraftSelection={(start, end) =>
            state.draft.setSelection(props.channel.id, start, end)
          }
        />
        <Show when={state.settings.getValue("appearance:show_send_button")}>
        <IconButton
          size="sm"
          variant="filled"
          shape="square"
          onPress={sendMessage}
        >
          <MdSend />
        </IconButton>
        </Show>
      </Row>
      <FilePasteCollector onFiles={onFiles} />
      <FileDropAnywhereCollector onFiles={onFiles} />
    </>
  );
}
