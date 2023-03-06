import { HeaderWithTransparency } from "@revolt/ui";
import { createEffect, createSignal, on } from "solid-js";
import { ChannelHeader } from "../ChannelHeader";
import { ChannelPageProps } from "../ChannelPage";
import { MessageComposition } from "./Composition";
import { Messages } from "./Messages";

/**
 * Channel component
 */
export function TextChannel(props: ChannelPageProps) {
  // Last unread message ID
  const [lastId, setLastId] = createSignal<string | undefined>(undefined);

  // Store last unread message ID
  createEffect(
    on(
      () => props.channel._id,
      (_id) =>
        setLastId(
          props.channel.unread
            ? props.channel.client.unreads!.getUnread(_id)?.last_id!
            : undefined
        )
    )
  );

  // Mark channel as read whenever it is marked as unread
  createEffect(
    on(
      () => props.channel.unread,
      (unread) =>
        unread &&
        props.channel.client.unreads!.markRead(
          props.channel._id,
          props.channel.last_message_id!,
          true
        )
    )
  );

  return (
    <>
      <HeaderWithTransparency palette="primary">
        <ChannelHeader channel={props.channel} />
      </HeaderWithTransparency>
      <Messages channel={props.channel} />
      <MessageComposition channel={props.channel} />
    </>
  );
}
