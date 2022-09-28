import { useClient } from "@revolt/client";
import {
  Component,
  createEffect,
  createSignal,
  For,
  Match,
  onCleanup,
  Show,
} from "solid-js";
import { Route, Routes, useParams } from "@revolt/routing";

import type { Message } from "revolt.js";

const Channel: Component = () => {
  const params = useParams();
  const client = useClient();
  const channel = () => client.channels.get(params.channel)!; //!

  const [messages, setMessages] = createSignal<Message[]>([]);

  createEffect(() => {
    channel()
      .fetchMessagesWithUsers()
      .then(({ messages }) => setMessages(messages));
  });

  function onMessage(msg: Message) {
    if (msg.channel_id === params.channel) {
      setMessages([msg, ...messages()]);
    }
  }

  client.addListener("message", onMessage);
  onCleanup(() => client.removeListener("message", onMessage));

  return (
    <div>
      we are in {channel().name ?? "unknown channel"}
      <br />
      <input id="trolling" />
      <button
        onClick={() => {
          let content = (
            document.querySelector("#trolling") as HTMLInputElement
          ).value;
          channel().sendMessage({ content });
        }}
      >
        send
      </button>
      <div
        style={{
          height: "50vh",
          display: "flex",
          "flex-direction": "column-reverse",
          overflow: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            "flex-direction": "column-reverse",
          }}
        >
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
      </div>
    </div>
  );
};

export const Content: Component = () => {
  return (
    <Routes>
      <Route
        path="/server/:server/*"
        element={
          <Routes>
            <Route path="/channel/:channel" element={<Channel />} />
            <Route path="/*" element={<span>server!</span>} />
          </Routes>
        }
      />
      <Route path="/channel/:channel" element={<Channel />} />
      <Route path="/*" element={<span>home page</span>} />
    </Routes>
  );
};
