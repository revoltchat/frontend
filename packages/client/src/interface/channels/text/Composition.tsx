import { MessageBox, MessageReplyPreview } from "@revolt/ui";
import type { DraftData } from "@revolt/state/stores/Draft";
import { useClient } from "@revolt/client";
import { state } from "@revolt/state";
import { Channel } from "revolt.js";
import { For, onCleanup } from "solid-js";

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
  function sendMessage() {
    props.channel.sendMessage(draft());
    state.draft.clearDraft(props.channel._id);
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
        channel={props.channel}
        content={() => draft()?.content ?? ""}
        setContent={(content) => set({ content })}
        sendMessage={sendMessage}
        addFile={() => {
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
        }}
      />
    </>
  );
}
