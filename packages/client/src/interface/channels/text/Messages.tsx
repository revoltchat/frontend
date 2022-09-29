import { useClient } from "@revolt/client";
import { styled } from "@revolt/ui";
import { ScrollContainer } from "@revolt/ui/components/common/ScrollContainers";
import { Channel, Message } from "revolt.js";
import {
  Accessor,
  createEffect,
  createSignal,
  For,
  onCleanup,
  Show,
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

  /* temporary */
  color: white;
`;

export function Messages({ channel }: { channel: Accessor<Channel> }) {
  const client = useClient();

  const [messages, setMessages] = createSignal<Message[]>([]);

  createEffect(() => {
    channel()
      .fetchMessagesWithUsers()
      .then(({ messages }) => setMessages(messages));
  });

  function onMessage(msg: Message) {
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
          {(message) => (
            <div>
              {message.author?.username}: {message.content}
              <Show when={message.attachments}>
                <For each={message.attachments}>
                  {(item) => (
                    <Show when={item.metadata.type === "Image"}>
                      <img
                        style={{
                          "max-width": "420px",
                          "max-height": "420px",
                        }}
                        src={`https://autumn.revolt.chat/attachments/${item._id}`}
                      />
                    </Show>
                  )}
                </For>
              </Show>
            </div>
          )}
        </For>
      </div>
    </Base>
  );
}
