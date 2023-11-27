import {
  BiRegularLink,
  BiSolidBot,
  BiSolidCloud,
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
  Avatar,
  BreakText,
  Column,
  Embed,
  MessageContainer,
  MessageReply,
  Reactions,
  SystemMessage,
  SystemMessageIcon,
  Tooltip,
  Username,
  floating,
  styled,
} from "@revolt/ui";

import { MessageContextMenu } from "../../../menus/MessageContextMenu";
import {
  floatingUserMenus,
  floatingUserMenusFromMessage,
} from "../../../menus/UserContextMenu";

floating;

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
    <MessageContainer
      username={
        <div use:floating={floatingUserMenusFromMessage(props.message)}>
          <Username
            username={props.message.username}
            colour={props.message.roleColour!}
          />
        </div>
      }
      avatar={
        <AvatarContainer
          use:floating={floatingUserMenusFromMessage(props.message)}
        >
          <Avatar size={36} src={props.message.avatarURL} />
        </AvatarContainer>
      }
      contextMenu={() => <MessageContextMenu message={props.message} />}
      timestamp={props.message.createdAt}
      edited={props.message.editedAt}
      tail={props.tail || state.settings.getValue("appearance:compact_mode")}
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
              props.message.masquerade &&
              props.message.authorId === "01FHGJ3NPP7XANQQH8C2BE44ZY"
            }
          >
            <Tooltip content={t("app.main.channel.bridged")} placement="top">
              <BiRegularLink size={16} />
            </Tooltip>
          </Match>
          <Match when={props.message.author?.privileged}>
            <Tooltip content={t("app.main.channel.team")} placement="top">
              <BiSolidShield size={16} />
            </Tooltip>
          </Match>
          <Match when={props.message.author?.bot}>
            <Tooltip content={t("app.main.channel.bot")} placement="top">
              <BiSolidBot size={16} />
            </Tooltip>
          </Match>
          <Match when={props.message.webhook}>
            <Tooltip content={t("app.main.channel.webhook")} placement="top">
              <BiSolidCloud size={16} />
            </Tooltip>
          </Match>
          <Match
            when={
              props.message.authorId &&
              dayjs().diff(decodeTime(props.message.authorId), "day") < 1
            }
          >
            <NewUser>
              <Tooltip content="New to Revolt" placement="top">
                <BiSolidLeaf size={16} />
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
              <Tooltip content="New to the server" placement="top">
                <BiSolidLeaf size={16} />
              </Tooltip>
            </NewUser>
          </Match>
          <Match when={props.message.authorId === "01EX2NCWQ0CHS3QJF0FEQS1GR4"}>
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
            menuGenerator={(user) =>
              user
                ? floatingUserMenus(
                    user!,
                    // TODO: try to fetch on demand member
                    props.message.server?.getMember(user!.id)
                  )
                : {}
            }
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
  );
}

/**
 * New user indicator
 */
const NewUser = styled.div`
  color: ${(props) => props.theme!.customColours.success.color};
`;

/**
 * Avatar container
 */
const AvatarContainer = styled.div`
  height: fit-content;
  border-radius: ${(props) => props.theme!.borderRadius.full};
`;
