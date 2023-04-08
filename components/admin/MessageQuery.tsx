import { For, Match, Switch, createEffect, createSignal, on } from "solid-js";

import { API, Message as MessageI } from "revolt.js";

import { useClient } from "@revolt/client";
import { Message } from "@revolt/ui";

import { PreviewMessage } from "./previews/PreviewMessage";

export function MessageQuery(props: {
  query?: API.MessageQuery;
  preview?: boolean;
}) {
  const [data, setData] = createSignal<MessageI[]>();
  const client = useClient();

  createEffect(
    on(
      () => props.query,
      (query) => {
        if (query) {
          client()
            .api.post("/admin/messages", query)
            .then((res) => {
              if (!Array.isArray(res)) {
                for (const user of res.users) {
                  client().User.new(user._id, user);
                }

                setData(
                  res.messages.map((message) =>
                    client().Message.new(message._id, message)
                  )
                );
              }
            });
        }
      }
    )
  );

  return (
    <For each={data()}>
      {(message) => (
        <Switch fallback={<Message message={message} />}>
          <Match when={props.preview}>
            <PreviewMessage message_id={message.id} />
          </Match>
        </Switch>
      )}
    </For>
  );
}
