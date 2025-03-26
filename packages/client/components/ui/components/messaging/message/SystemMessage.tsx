import { JSX, Match, Switch } from "solid-js";
import { styled } from "styled-system/jsx";

import {
  ChannelEditSystemMessage,
  ChannelOwnershipChangeSystemMessage,
  ChannelRenamedSystemMessage,
  SystemMessage as SystemMessageClass,
  TextSystemMessage,
  User,
  UserModeratedSystemMessage,
  UserSystemMessage,
} from "revolt.js";

import { cva } from "styled-system/css";
import { RenderMention } from "@revolt/markdown/plugins/mentions";
import { Trans } from "@lingui-solid/solid/macro";

interface Props {
  /**
   * System Message
   */
  systemMessage: SystemMessageClass;

  /**
   * Menu generator
   */
  menuGenerator: (user?: User) => JSX.Directives["floating"];

  /**
   * Whether this is rendered within a server
   */
  isServer: boolean;
}

/**
 * Render the actual user
 */
function Usr(props: { user?: User } & Pick<Props, "menuGenerator">) {
  return (
    <div class={username()} use:floating={props.menuGenerator(props.user)}>
      {props.user?.username}
    </div>
  );
}

/**
 * System Message
 */
export function SystemMessage(props: Props) {
  // TODO: i18n with components
  return (
    <Base>
      <Switch fallback={props.systemMessage.type}>
        <Match when={props.systemMessage.type === "user_added"}>
          <Trans>
            <RenderMention
              userId={
                (props.systemMessage as UserModeratedSystemMessage).userId
              }
            />
            has been added by
            <RenderMention
              userId={(props.systemMessage as UserModeratedSystemMessage).byId}
            />
          </Trans>
        </Match>
        <Match
          when={props.systemMessage.type === "user_left" && !props.isServer}
        >
          <Trans>
            <RenderMention
              userId={(props.systemMessage as UserSystemMessage).userId}
            />
            left the group
          </Trans>
        </Match>
        <Match when={props.systemMessage.type === "user_remove"}>
          <Trans>
            <RenderMention
              userId={
                (props.systemMessage as UserModeratedSystemMessage).userId
              }
            />
            has been removed by
            <RenderMention
              userId={(props.systemMessage as UserModeratedSystemMessage).byId}
            />
          </Trans>
        </Match>
        <Match when={props.systemMessage.type === "user_kicked"}>
          <Trans>
            <RenderMention
              userId={(props.systemMessage as UserSystemMessage).userId}
            />
            has been kicked from the server
          </Trans>
        </Match>
        <Match when={props.systemMessage.type === "user_banned"}>
          <Trans>
            <RenderMention
              userId={(props.systemMessage as UserSystemMessage).userId}
            />
            has been banned from the server
          </Trans>
        </Match>
        <Match when={props.systemMessage.type === "user_joined"}>
          <Trans>
            <RenderMention
              userId={(props.systemMessage as UserSystemMessage).userId}
            />
            joined the server
          </Trans>
        </Match>
        <Match
          when={props.systemMessage.type === "user_left" && props.isServer}
        >
          <Trans>
            <RenderMention
              userId={(props.systemMessage as UserSystemMessage).userId}
            />
            left the server
          </Trans>
        </Match>
        <Match when={props.systemMessage.type === "channel_renamed"}>
          <Trans>
            <RenderMention
              userId={(props.systemMessage as ChannelRenamedSystemMessage).byId}
            />
            updated the group name to{" "}
            <div class={username()}>
              {(props.systemMessage as ChannelRenamedSystemMessage).name}
            </div>
          </Trans>
        </Match>
        <Match
          when={props.systemMessage.type === "channel_description_changed"}
        >
          <Trans>
            <RenderMention
              userId={(props.systemMessage as ChannelEditSystemMessage).byId}
            />
            updated the group description
          </Trans>
        </Match>
        <Match when={props.systemMessage.type === "channel_icon_changed"}>
          <Trans>
            <RenderMention
              userId={(props.systemMessage as ChannelEditSystemMessage).byId}
            />
            updated the group icon
          </Trans>
        </Match>
        <Match when={props.systemMessage.type === "channel_ownership_changed"}>
          <Trans>
            <RenderMention
              userId={
                (props.systemMessage as ChannelOwnershipChangeSystemMessage)
                  .fromId
              }
            />
            transferred group ownership to
            <RenderMention
              userId={
                (props.systemMessage as ChannelOwnershipChangeSystemMessage)
                  .toId
              }
            />
          </Trans>
        </Match>
        <Match when={props.systemMessage.type === "text"}>
          {(props.systemMessage as TextSystemMessage).content}
        </Match>
      </Switch>
    </Base>
  );
}

const Base = styled("div", {
  base: {
    display: "flex",
    minHeight: "20px",
    gap: "var(--gap-sm)",
    alignItems: "center",
    color: "var(--colours-messaging-component-system-message-foreground)",
  },
});

const username = cva({
  base: {
    color: "var(--colours-foreground)",
  },
});
