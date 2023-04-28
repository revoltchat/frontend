import {
  BiRegularLink,
  BiSolidBot,
  BiSolidLeaf,
  BiSolidShield,
} from "solid-icons/bi";
import { For, Match, Show, Switch, onMount } from "solid-js";

import { Message as MessageInterface, WebsiteEmbed } from "revolt.js";
import { decodeTime } from "ulid";

import { useClient } from "@revolt/client";
import { dayjs, useTranslation } from "@revolt/i18n";
import { Markdown } from "@revolt/markdown";
import { state } from "@revolt/state";
import {
  Attachment,
  BreakText,
  Column,
  Embed,
  MessageContainer,
  Reactions,
  SystemMessage,
  SystemMessageIcon,
  Tooltip,
  UserCard,
  Username,
  styled,
} from "@revolt/ui";
import { MessageReply } from "@revolt/ui/components/messaging/message/MessageReply";

/**
 * Regex for matching URLs
 */
const RE_URL =
  /[(http(s)?)://(www.)?a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/;

interface Props {
  /**
   * Message
   */
  message: MessageInterface;

  /**
   * Whether this is the tail of another message
   */
  tail?: boolean;
}

/**
 * Render a Message with or without a tail
 */
export function Message(props: Props) {
  const t = useTranslation();
  const client = useClient();

  /**
   * Determine whether this message only contains a GIF
   */
  const isOnlyGIF = () =>
    props.message.embeds &&
    props.message.embeds.length === 1 &&
    props.message.embeds[0].type === "Website" &&
    (props.message.embeds[0] as WebsiteEmbed).specialContent?.type === "GIF" &&
    props.message.content &&
    !props.message.content.replace(RE_URL, "").length;

  /**
   * React with an emoji
   * @param emoji Emoji
   */
  const react = (emoji: string) => props.message.react(emoji);

  /**
   * Remove emoji reaction
   * @param emoji Emoji
   */
  const unreact = (emoji: string) => props.message.unreact(emoji);

  return (
    <>
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
                /**
                 * Signal the actual message
                 */
                const message = () => client().messages.get(reply_id);

                onMount(() => {
                  if (!message()) {
                    props.message.channel!.fetchMessage(reply_id);
                  }
                });

                return (
                  <MessageReply
                    mention={props.message.mentionIds?.includes(
                      message()!.authorId!
                    )}
                    message={message()}
                  />
                );
              }}
            </For>
          </Show>
        }
        info={
          <Switch fallback={<div />}>
            <Match
              when={
                props.message.authorId &&
                dayjs().diff(decodeTime(props.message.authorId), "day") < 1
              }
            >
              <NewUser>
                <Tooltip content={"New to Revolt"} placement="top" aria>
                  {(triggerProps) => (
                    <BiSolidLeaf {...triggerProps} size={16} />
                  )}
                </Tooltip>
              </NewUser>
            </Match>
            <Match
              when={
                props.message.member &&
                dayjs().diff(props.message.member.joinedAt, "day") < 1
              }
            >
              <NewUser>
                <Tooltip content={"New to the server"} placement="top" aria>
                  {(triggerProps) => (
                    <BiSolidLeaf {...triggerProps} size={16} />
                  )}
                </Tooltip>
              </NewUser>
            </Match>
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
                {(triggerProps) => (
                  <BiRegularLink {...triggerProps} size={16} />
                )}
              </Tooltip>
            </Match>
            <Match when={props.message.author?.privileged}>
              <Tooltip
                content={t("app.main.channel.team")}
                placement="top"
                aria
              >
                {(triggerProps) => (
                  <BiSolidShield {...triggerProps} size={16} />
                )}
              </Tooltip>
            </Match>
            <Match when={props.message.author?.bot}>
              <Tooltip content={t("app.main.channel.bot")} placement="top" aria>
                {(triggerProps) => <BiSolidBot {...triggerProps} size={16} />}
              </Tooltip>
            </Match>
            <Match
              when={props.message.authorId === "01EX2NCWQ0CHS3QJF0FEQS1GR4"}
            >
              <span />
              <span>he/him &middot; </span>
            </Match>
          </Switch>
        }
        compact={
          !!props.message.systemMessage ||
          state.settings.getValue("appearance:compact_mode")
        }
        infoMatch={
          <Match when={props.message.systemMessage}>
            <SystemMessageIcon
              systemMessage={props.message.systemMessage!}
              createdAt={props.message.createdAt}
              isServer={!!props.message.server}
            />
          </Match>
        }
      >
        <Column gap="sm">
          <Show when={props.message.systemMessage}>
            <SystemMessage
              systemMessage={props.message.systemMessage!}
              isServer={!!props.message.server}
            />
          </Show>
          <Show when={props.message.content && !isOnlyGIF()}>
            <BreakText>
              <Markdown content={props.message.content!} />
            </BreakText>
          </Show>
          <Show when={props.message.attachments}>
            <For each={props.message.attachments}>
              {(attachment) => <Attachment file={attachment} />}
            </For>
          </Show>
          <Show when={props.message.embeds}>
            <For each={props.message.embeds}>
              {(embed) => <Embed embed={embed} />}
            </For>
          </Show>
          <Reactions
            reactions={props.message.reactions}
            interactions={props.message.interactions}
            userId={client().user!.id}
            addReaction={react}
            removeReaction={unreact}
          />
        </Column>
      </MessageContainer>
    </>
  );
}

/**
 * New user indicator
 *
 * TODO: move this somewhere else?
 */
const NewUser = styled.div`
  color: ${(props) => props.theme!.colours["success-100"]};
`;
