import { Message as MessageInterface } from "revolt.js";
import { For, Show } from "solid-js";
import { Attachments } from "./Attachments";
import { MessageContainer } from "./Container";
import { Embeds } from "./Embeds";

/**
 * Render a Message with or without a tail
 */
export function Message({
  message,
  tail,
}: {
  message: MessageInterface;
  tail?: boolean;
}) {
  const content = message.system?.type || message.content 
  return (
    <MessageContainer
      username={message.username}
      avatar={message.avatarURL}
      colour={message.roleColour}
      timestamp={message.createdAt}
      edited={message.edited}
      tail={tail}
      header={
        <Show when={message.reply_ids}>
          <For each={message.reply_ids}>
            {(reply_id) => <div>{reply_id}</div>}
          </For>
        </Show>
      }
    >
      {content}
      <Show when={message.attachments}>
        <Attachments
          attachments={() => message.attachments!}
          baseUrl={message.client.configuration?.features.autumn.url!}
        />
      </Show>
      <Show when={message.embeds}>
        <Embeds
          embeds={() => message.embeds!}
          proxyFile={message.client.proxyFile}
        />
      </Show>
    </MessageContainer>
  );
}
