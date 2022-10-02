import { useClient } from "@revolt/client";
import { Message, ScrollContainer, styled } from "@revolt/ui";
import type { Message as MessageType } from "revolt.js";
import { Channel } from "revolt.js";
import {
  Accessor,
  createEffect,
  createSignal,
  For,
  onCleanup,
} from "solid-js";

const Base = styled(ScrollContainer)`
  flex-grow: 1;

  display: flex;
  overflow: auto;
  flex-direction: column-reverse;

  > div {
    display: flex;
    flex-direction: column-reverse;
  }

  /* TODO: temporary */
  color: white;
`;

export function Messages({ channel }: { channel: Accessor<Channel> }) {
  const client = useClient();

  const [messages, setMessages] = createSignal<MessageType[]>([]);

  createEffect(() => {
    channel()
      .fetchMessagesWithUsers()
      .then(({ messages }) => setMessages(messages));
  });

  function onMessage(msg: MessageType) {
    if (msg.channel_id === channel()._id) {
      setMessages([msg, ...messages()]);
    }
  }

  client.addListener("message", onMessage);
  onCleanup(() => client.removeListener("message", onMessage));

  return (
    <Base offsetTop={48}>
      <div>
        <For each={messages()}>
          {(message, i) => {
            let prev = messages()[i() + 1];
            let head = prev?.author?._id !== message.author?._id;

            return (
              <Message message={message} head={head} />
            );
          }}
        </For>
      </div>
    </Base>
  );
}
