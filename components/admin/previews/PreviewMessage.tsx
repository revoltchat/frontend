import {
  For,
  Match,
  Show,
  Switch,
  createEffect,
  createSignal,
  on,
} from "solid-js";

import { Message as MessageI } from "revolt.js";

import { useClient } from "@revolt/client";
import { state } from "@revolt/state";
import { Button, Column, Row } from "@revolt/ui";

import { MessageQuery } from "../MessageQuery";
import { ChannelPreview } from "../pages/Inspector";

import { PreviewChannel } from "./PreviewChannel";

export function PreviewMessage(props: {
  message_id?: string;
  channel_id?: string;
}) {
  const client = useClient();
  const message = () => client().messages.get(props.message_id!);
  const [context, setContext] = createSignal(false);

  createEffect(
    on(
      () => message(),
      (message) =>
        !message &&
        props.channel_id &&
        client()
          .channels.fetch(props.channel_id!)
          .then((channel) => channel.fetchMessage(props.message_id!))
    )
  );

  return (
    <Switch fallback={props.message_id}>
      <Match when={message()}>
        <Column>
          <Row align="center">
            <Column>
              <Button
                compact="fluid"
                onClick={() =>
                  state.admin.addTab({
                    title: "Inspect Channel",
                    type: "inspector",
                    id: message()!.channelId,
                    typeHint: "channel",
                  })
                }
              >
                <PreviewChannel channel_id={message()!.channelId} />
              </Button>
              <Button palette="secondary" onClick={() => setContext(true)}>
                Fetch Context
              </Button>
            </Column>
            <div>{/*<Message message={message()!} />*/}</div>
          </Row>
          <Show when={context()}>
            <ChannelPreview>
              <MessageQuery
                query={{
                  nearby: message()!.id,
                  channel: message()!.channelId,
                }}
              />
            </ChannelPreview>
          </Show>
        </Column>
      </Match>
    </Switch>
  );
}
