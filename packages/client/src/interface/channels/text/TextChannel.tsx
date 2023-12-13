import { Show, createEffect, createSignal, on } from "solid-js";

import { decodeTime, ulid } from "ulid";

import { Messages } from "@revolt/app";
import { useClient } from "@revolt/client";
import { useNavigate, useSmartParams } from "@revolt/routing";
import { state } from "@revolt/state";
import { LAYOUT_SECTIONS } from "@revolt/state/stores/Layout";
import {
  BelowFloatingHeader,
  HeaderWithTransparency,
  NewMessages,
  TypingIndicator,
  styled,
} from "@revolt/ui";

import { ChannelHeader } from "../ChannelHeader";
import { ChannelPageProps } from "../ChannelPage";

import { MessageComposition } from "./Composition";
import { MemberSidebar } from "./MemberSidebar";

/**
 * Channel component
 */
export function TextChannel(props: ChannelPageProps) {
  const client = useClient();

  // Last unread message id
  const [lastId, setLastId] = createSignal<string>();

  // Read highlighted message id from parameters
  const params = useSmartParams();
  const navigate = useNavigate();

  /**
   * Message id to be highlighted
   * @returns Message Id
   */
  const highlightMessageId = () => params().messageId;

  // Get a reference to the message box's load latest function
  let loadLatestRef: ((nearby?: string) => void) | undefined;

  // Get a reference to the message list's "end status"
  let atEndRef: (() => boolean) | undefined;

  // Store last unread message id
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
      (unread) => {
        if (unread) {
          if (document.hasFocus()) {
            // acknowledge the message
            props.channel.ack();
          } else {
            // otherwise mark this location as the last read location
            if (!lastId()) {
              // (taking away one second from the seed)
              setLastId(ulid(decodeTime(props.channel.lastMessageId!) - 1));
            }

            // TODO: ack on refocus
          }
        }
      }
    )
  );

  return (
    <>
      <HeaderWithTransparency placement="primary">
        <ChannelHeader channel={props.channel} />
      </HeaderWithTransparency>
      <Content>
        <MessagingStack>
          <BelowFloatingHeader>
            <div>
              <NewMessages
                lastId={lastId}
                jumpBack={() => navigate(lastId()!)}
                dismiss={() => setLastId()}
              />
            </div>
          </BelowFloatingHeader>
          <Messages
            channel={props.channel}
            limit={150}
            lastReadId={lastId}
            highlightedMessageId={highlightMessageId}
            clearHighlightedMessage={() => navigate(".")}
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
