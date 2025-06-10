import { For, Match, Show, Switch, onMount } from "solid-js";

import { useLingui } from "@lingui-solid/solid/macro";
import { Message as MessageInterface, WebsiteEmbed } from "revolt.js";
import { cva } from "styled-system/css";
import { styled } from "styled-system/jsx";
import { decodeTime } from "ulid";

import { useClient } from "@revolt/client";
import { useTime } from "@revolt/i18n";
import { Markdown } from "@revolt/markdown";
import { useState } from "@revolt/state";
import {
  Attachment,
  Avatar,
  Embed,
  MessageContainer,
  MessageReply,
  Reactions,
  SystemMessage,
  SystemMessageIcon,
  Tooltip,
  Username,
  iconSize,
} from "@revolt/ui";

import MdCloud from "@material-design-icons/svg/filled/cloud.svg?component-solid";
import MdLink from "@material-design-icons/svg/filled/link.svg?component-solid";
import MdNotificationsOff from "@material-design-icons/svg/filled/notifications_off.svg?component-solid";
import MdShield from "@material-design-icons/svg/filled/shield.svg?component-solid";
import MdSmartToy from "@material-design-icons/svg/filled/smart_toy.svg?component-solid";
import MdSpa from "@material-design-icons/svg/filled/spa.svg?component-solid";

import { MessageContextMenu } from "../../../menus/MessageContextMenu";
import {
  floatingUserMenus,
  floatingUserMenusFromMessage,
} from "../../../menus/UserContextMenu";

import { EditMessage } from "./EditMessage";

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

  /**
   * Whether to highlight this message
   */
  highlight?: boolean;

  /**
   * Whether to replace content with editor
   */
  editing?: boolean;

  /**
   * Whether this message is a link
   */
  isLink?: boolean;
}

/**
 * Render a Message with or without a tail
 */
export function Message(props: Props) {
  const dayjs = useTime();
  const state = useState();
  const { t } = useLingui();
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
        <div
          class={avatarContainer()}
          use:floating={floatingUserMenusFromMessage(props.message)}
        >
          <Avatar size={36} src={props.message.avatarURL} />
        </div>
      }
      contextMenu={() => <MessageContextMenu message={props.message} />}
      timestamp={props.message.createdAt}
      edited={props.message.editedAt}
      mentioned={props.message.mentioned}
      highlight={props.highlight}
      editing={props.editing}
      isLink={props.isLink}
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
                    message()!.authorId!,
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
            <Tooltip
              content={t`Message was sent on another platform`}
              placement="top"
            >
              <MdLink {...iconSize(16)} />
            </Tooltip>
          </Match>
          <Match when={props.message.author?.privileged}>
            <Tooltip content={t`Official Communication`} placement="top">
              <MdShield {...iconSize(16)} />
            </Tooltip>
          </Match>
          <Match when={props.message.author?.bot}>
            <Tooltip content={t`Bot`} placement="top">
              <MdSmartToy {...iconSize(16)} />
            </Tooltip>
          </Match>
          <Match when={props.message.webhook}>
            <Tooltip content={t`Webhook`} placement="top">
              <MdCloud {...iconSize(16)} />
            </Tooltip>
          </Match>
          <Match when={props.message.isSuppressed}>
            <Tooltip content={t`Silent`} placement="top">
              <MdNotificationsOff {...iconSize(16)} />
            </Tooltip>
          </Match>
          <Match
            when={
              props.message.authorId &&
              dayjs().diff(decodeTime(props.message.authorId), "day") < 1
            }
          >
            <NewUser>
              <Tooltip content={t`New to Revolt`} placement="top">
                <MdSpa {...iconSize(16)} />
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
              <Tooltip content={t`New to the server`} placement="top">
                <MdSpa {...iconSize(16)} />
              </Tooltip>
            </NewUser>
          </Match>
          {/* <Match when={props.message.authorId === "01EX2NCWQ0CHS3QJF0FEQS1GR4"}>
            <span />
            <span>placeholder &middot; </span>
          </Match> */}
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
      <Show when={props.message.systemMessage}>
        <SystemMessage
          systemMessage={props.message.systemMessage!}
          menuGenerator={(user) =>
            user
              ? floatingUserMenus(
                  user!,
                  // TODO: try to fetch on demand member
                  props.message.server?.getMember(user!.id),
                )
              : {}
          }
          isServer={!!props.message.server}
        />
      </Show>
      <Switch>
        <Match when={props.editing}>
          <EditMessage message={props.message} />
        </Match>
        <Match when={props.message.content && !isOnlyGIF()}>
          <BreakText>
            <Markdown content={props.message.content!} />
          </BreakText>
        </Match>
      </Switch>
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
        reactions={props.message.reactions as never as Map<string, Set<string>>}
        interactions={props.message.interactions}
        userId={client().user!.id}
        addReaction={react}
        removeReaction={unreact}
      />
    </MessageContainer>
  );
}

/**
 * New user indicator
 */
const NewUser = styled("div", {
  base: {
    color: "var(--md-sys-color-primary)",
  },
});

/**
 * Avatar container
 */
const avatarContainer = cva({
  base: {
    height: "fit-content",
    borderRadius: "var(--borderRadius-circle)",
  },
});

/**
 * Break all text and prevent overflow from math blocks
 */
const BreakText = styled("div", {
  base: {
    wordBreak: "break-word",

    "& .math": {
      overflowX: "auto",
      overflowY: "hidden",
      maxHeight: "100vh",
    },
  },
});
