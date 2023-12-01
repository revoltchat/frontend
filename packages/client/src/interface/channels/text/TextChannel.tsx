import { Show, createEffect, createSignal, on } from "solid-js";

import { Messages } from "@revolt/app";
import { useClient } from "@revolt/client";
import { state } from "@revolt/state";
import { LAYOUT_SECTIONS } from "@revolt/state/stores/Layout";
import { HeaderWithTransparency, TypingIndicator, styled } from "@revolt/ui";

import { ChannelHeader } from "../ChannelHeader";
import { ChannelPageProps } from "../ChannelPage";

import { MessageComposition } from "./Composition";
import { MemberSidebar } from "./MemberSidebar";

/**
 * Channel component
 */
export function TextChannel(props: ChannelPageProps) {
  const client = useClient();

  // Last unread message ID
  const [_lastId, setLastId] = createSignal<string | undefined>(undefined);

  // Get a reference to the message box's load latest function
  let loadLatestRef: ((nearby?: string) => void) | undefined;

  // Get a reference to the message list's "end status"
  let atEndRef: (() => boolean) | undefined;

  // Store last unread message ID
  createEffect(
    on(
      () => props.channel.id,
      (id) =>
        setLastId(
          props.channel.unread
            ? (client().channelUnreads.get(id)?.lastMessageId as string)
            : undefined
        )
    )
  );

  // Mark channel as read whenever it is marked as unread
  createEffect(
    on(
      // must be at the end of the conversation
      () => props.channel.unread && (atEndRef ? atEndRef() : true),
      (unread) => unread && props.channel.ack()
    )
  );

  return (
    <>
      <HeaderWithTransparency placement="primary">
        <ChannelHeader channel={props.channel} />
      </HeaderWithTransparency>
      <Content>
        <MessagingStack>
          <Messages
            channel={props.channel}
            limit={150}
            atEndRef={(ref) => (atEndRef = ref)}
            loadInitialMessagesRef={(ref) => (loadLatestRef = ref)}
          />
          <TypingIndicator
            users={props.channel.typing}
            ownId={client().user!.id}
          />
          <MessageComposition
            channel={props.channel}
            onMessageSend={() => loadLatestRef?.()}
          />
        </MessagingStack>
        <Show
          when={state.layout.getSectionState(
            LAYOUT_SECTIONS.MEMBER_SIDEBAR,
            true
          )}
        >
          <MemberSidebar channel={props.channel} />
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

  padding: 0 ${(props) => props.theme!.gap.md} 0 0;
`;
