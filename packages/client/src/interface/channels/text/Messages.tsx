import { useClient } from "@revolt/client";
import { Avatar, styled } from "@revolt/ui";
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
import { Info } from "./Info";

export type MessageProps = {
  message: Message;
  head?: boolean;
}

{/*
  TODO: Should we start organizing components by having css on a separated file + a folder per component?
  Eg:
    > components
      > interface
        > channels
          > info
            > Info.tsx
            > Info.css
          > message
            > Message.tsx
            > Message.css
          [...]
*/}

const Base = styled(ScrollContainer)`
  flex-grow: 1;

  display: flex;
  overflow: auto;
  flex-direction: column-reverse;

  > div {
    display: flex;
    flex-direction: column-reverse;
  }

  color: var(--foreground);
`;

const MessageBase = styled.div`
  display: flex;
  line-height: 18px;
`;

const Content = styled.div`
  position: relative;
  min-width: 0px;
  font-size: var(--text-size);
`;

const MessageHeader = styled.div`
  gap: 6px;
  display: flex;
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
          {(message, i) => {
            const prev = messages()[i() + 1];
            const head = prev?.author?._id !== message.author?._id;

            return (
              <MessageBase style={{ "margin-top": head ? '12px' : '', padding: '0.125rem' }}>
                <Show when={head}>
                  <div style={{ "padding": '0 5px 0 5px' }}>
                    <Avatar
                      size={36}
                      src={message.author?.generateAvatarURL({ max_side: 256 })}
                      interactive
                    />
                  </div>
                </Show>
                <Show when={!head}>
                  <div style={{ width: "46px" }} />
                </Show>
                <Content>
                  <Show when={head}>
                    <MessageHeader>
                      <span>{message.author?.username}</span>
                      <Info message={message} head={head} />
                    </MessageHeader>
                  </Show>

                  <span>{message.content}</span>
                  <Show when={message.attachments}>
                    <For each={message.attachments}>
                      {(item) => (
                        <Show when={item.metadata.type === "Image"}>
                          <img
                            alt="Attachment"
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
                </Content>
              </MessageBase>
            );
          }}
        </For>
      </div>
    </Base>
  );
}
