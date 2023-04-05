import { Show, createEffect, createSignal, on, onMount } from "solid-js";

import { state } from "@revolt/state";
import { LAYOUT_SECTIONS } from "@revolt/state/stores/Layout";
import { HeaderWithTransparency, TypingIndicator, styled } from "@revolt/ui";

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
            ? (props.channel.client.unreads!.getUnread(_id)?.last_id as string)
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

  /*onMount(() => {
    props.channel.server?.fetchMembers();
  });*/

  return (
    <>
      <HeaderWithTransparency palette="primary">
        <ChannelHeader channel={props.channel} />
      </HeaderWithTransparency>
      <Content>
        <MessagingStack>
          <Messages channel={props.channel} />
          <TypingIndicator users={props.channel.typing} />
          <MessageComposition channel={props.channel} />
        </MessagingStack>
        <Show
          when={state.layout.getSectionState(
            LAYOUT_SECTIONS.MEMBER_SIDEBAR,
            true
          )}
        >
          <div
            style={{
              "flex-shrink": 0,
              width: "232px",
              background: "#222",
            }}
          >
            test
          </div>
        </Show>
      </Content>
    </>
  );
}

/**
 * Main content row layout
 */
const Content = styled.div`
  display: flex;
  flex-direction: row;

  flex-grow: 1;
  min-width: 0;
  min-height: 0;
`;

/**
 * Component housing messages and composition
 */
const MessagingStack = styled.div`
  display: flex;
  flex-direction: column;

  flex-grow: 1;
  min-width: 0;
  min-height: 0;
`;
