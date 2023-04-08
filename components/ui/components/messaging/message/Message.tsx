import { BiRegularLink, BiSolidBot, BiSolidShield } from "solid-icons/bi";
import { For, Match, Show, Switch } from "solid-js";

import { Message as MessageInterface } from "revolt.js";

import { useTranslation } from "@revolt/i18n";
import { Markdown } from "@revolt/markdown";

import { Column } from "../../design";
import { Username } from "../../design/atoms/display/Username";
import { Tooltip, UserCard } from "../../floating";

import { Attachment } from "./Attachment";
import { MessageContainer } from "./Container";
import { Embed } from "./Embed";
import { Reactions } from "./Reactions";

const RE_URL =
  /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

/**
 * Render a Message with or without a tail
 */
export function Message(props: { message: MessageInterface; tail?: boolean }) {
  // const baseUrl = props.message.client.configuration!.features.autumn.url!;
  const baseUrl = "https://autumn.revolt.chat";
  const t = useTranslation();

  /**
   * Determine whether this message only contains a GIF
   */
  const isOnlyGIF = () =>
    props.message.embeds &&
    props.message.embeds.length === 1 &&
    props.message.embeds[0].type === "Website" &&
    props.message.embeds[0].special?.type === "GIF" &&
    props.message.content &&
    !props.message.content.replace(RE_URL, "").length;

  return (
    <MessageContainer
      username={
        <UserCard user={props.message.author!} member={props.message.member}>
          {(triggerProps) => (
            <Username
              {...triggerProps}
              username={props.message.username}
              colour={props.message.roleColour!}
            />
          )}
        </UserCard>
      }
      avatar={props.message.avatarURL}
      timestamp={props.message.createdAt}
      edited={props.message.editedAt}
      tail={props.tail}
      header={
        <Show when={props.message.replyIds}>
          <For each={props.message.replyIds}>
            {(reply_id) => {
              /*const message = () => props.message.client.messages.get(reply_id);

              onMount(() => {
                if (!message()) {
                  props.message.channel!.fetchMessage(reply_id);
                }
              });

              return (
                <MessageReply
                  mention={props.message.mention_ids?.includes(
                    message()!.author_id
                  )}
                  message={message()}
                />
              );*/
              return "reply";
            }}
          </For>
        </Show>
      }
      info={
        <Switch fallback={<div />}>
          <Match
            when={
              props.message.masquerade &&
              props.message.authorId === "01FHGJ3NPP7XANQQH8C2BE44ZY"
            }
          >
            <Tooltip
              content={t("app.main.channel.bridged")}
              placement="top"
              aria
            >
              {(triggerProps) => <BiRegularLink {...triggerProps} size={16} />}
            </Tooltip>
          </Match>
          <Match when={props.message.author?.privileged}>
            <Tooltip content={t("app.main.channel.team")} placement="top" aria>
              {(triggerProps) => <BiSolidShield {...triggerProps} size={16} />}
            </Tooltip>
          </Match>
          <Match when={props.message.author?.bot}>
            <Tooltip content={t("app.main.channel.bot")} placement="top" aria>
              {(triggerProps) => <BiSolidBot {...triggerProps} size={16} />}
            </Tooltip>
          </Match>
          <Match when={props.message.authorId === "01EX2NCWQ0CHS3QJF0FEQS1GR4"}>
            <span />
            <span>he/him &middot; </span>
          </Match>
        </Switch>
      }
    >
      <Column gap="sm">
        <Show when={props.message.content && !isOnlyGIF()}>
          <Markdown content={props.message.content!} />
        </Show>
        <Show when={props.message.systemMessage}>
          {props.message.systemMessage!.type}
        </Show>
        <Show when={props.message.attachments}>
          <For each={props.message.attachments}>
            {(attachment) => <Attachment file={attachment} baseUrl={baseUrl} />}
          </For>
        </Show>
        <Show when={props.message.embeds}>
          <For each={props.message.embeds}>
            {(embed) => (
              <Embed
                embed={embed}
                proxyFile={/*props.message.client.proxyFile*/ (a) => a}
                baseUrl={baseUrl}
              />
            )}
          </For>
        </Show>
        <Reactions
          reactions={props.message.reactions}
          interactions={props.message.interactions!}
          /*userId={props.message.client.user?._id}*/
          userId=""
          addReaction={(id) => props.message.react(id)}
          removeReaction={(id) => props.message.unreact(id)}
        />
      </Column>
    </MessageContainer>
  );
}
