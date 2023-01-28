import { MessageBox, MessageReplyPreview } from "@revolt/ui";
import type { DraftData } from "@revolt/state/stores/Draft";
import { useClient } from "@revolt/client";
import { state } from "@revolt/state";
import { Channel } from "revolt.js";
import { For } from "solid-js";

interface Props {
  channel: Channel;
}

/**
 * Message composition engine
 */
export function MessageComposition(props: Props) {
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

  // ESC logic goes here
  // first it clears mentions
  // then it clears files
  // then it allows scroll

  return (
    <>
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
        channel={props.channel}
        content={() => draft()?.content ?? ""}
        setContent={(content) => set({ content })}
        sendMessage={sendMessage}
      />
    </>
  );
}
