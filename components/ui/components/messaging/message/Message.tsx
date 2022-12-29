import { Markdown } from "@revolt/markdown";
import { Message as MessageInterface } from "revolt.js";
import { For, Show } from "solid-js";
import { Column } from "../../design";
import { Attachment } from "./Attachment";
import { MessageContainer } from "./Container";
import { Embed } from "./Embed";

/**
 * Render a Message with or without a tail
 */
export function Message(props: { message: MessageInterface; tail?: boolean }) {
  return (
    <MessageContainer
      username={props.message.username}
      avatar={props.message.avatarURL}
      colour={props.message.roleColour}
      timestamp={props.message.createdAt}
      edited={props.message.edited ? +props.message.edited : undefined}
      tail={props.tail}
      header={
        <Show when={props.message.reply_ids}>
          <For each={props.message.reply_ids}>
            {(reply_id) => <div>{reply_id}</div>}
          </For>
        </Show>
      }
    >
      <Column gap="sm">
        <Show when={props.message.content}>
          <Markdown content={props.message.content!} />
        </Show>
        <Show when={props.message.attachments}>
          <For each={props.message.attachments}>
            {(attachment) => (
              <Attachment
                file={attachment}
                baseUrl={
                  props.message.client.configuration?.features.autumn.url!
                }
              />
            )}
          </For>
        </Show>
        <Show when={props.message.embeds}>
          <For each={props.message.embeds}>
            {(embed) => (
              <Embed embed={embed} proxyFile={props.message.client.proxyFile} />
            )}
          </For>
        </Show>
      </Column>
    </MessageContainer>
  );
}
