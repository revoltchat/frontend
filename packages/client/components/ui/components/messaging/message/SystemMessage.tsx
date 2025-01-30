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

import { Typography } from "../../design";
import { cva } from "styled-system/css";
import { RenderMention } from "@revolt/markdown/plugins/mentions";

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
          <RenderMention
            userId={(props.systemMessage as UserModeratedSystemMessage).userId}
          />
          has been added by
          <RenderMention
            userId={(props.systemMessage as UserModeratedSystemMessage).byId}
          />
        </Match>
        <Match
          when={props.systemMessage.type === "user_left" && !props.isServer}
        >
          <RenderMention
            userId={(props.systemMessage as UserSystemMessage).userId}
          />
          left the group
        </Match>
        <Match when={props.systemMessage.type === "user_remove"}>
          <RenderMention
            userId={(props.systemMessage as UserModeratedSystemMessage).userId}
          />
          has been removed by
          <RenderMention
            userId={(props.systemMessage as UserModeratedSystemMessage).byId}
          />
        </Match>
        <Match when={props.systemMessage.type === "user_kicked"}>
          <RenderMention
            userId={(props.systemMessage as UserSystemMessage).userId}
          />
          has been kicked from the server
        </Match>
        <Match when={props.systemMessage.type === "user_banned"}>
          <RenderMention
            userId={(props.systemMessage as UserSystemMessage).userId}
          />
          has been banned from the server
        </Match>
        <Match when={props.systemMessage.type === "user_joined"}>
          <RenderMention
            userId={(props.systemMessage as UserSystemMessage).userId}
          />
          joined the server
        </Match>
        <Match
          when={props.systemMessage.type === "user_left" && props.isServer}
        >
          <RenderMention
            userId={(props.systemMessage as UserSystemMessage).userId}
          />
          left the server
        </Match>
        <Match when={props.systemMessage.type === "channel_renamed"}>
          <RenderMention
            userId={(props.systemMessage as ChannelRenamedSystemMessage).byId}
          />
          updated the group name to{" "}
          <div class={username()}>
            {(props.systemMessage as ChannelRenamedSystemMessage).name}
          </div>
        </Match>
        <Match
          when={props.systemMessage.type === "channel_description_changed"}
        >
          <RenderMention
            userId={(props.systemMessage as ChannelEditSystemMessage).byId}
          />
          updated the group description
        </Match>
        <Match when={props.systemMessage.type === "channel_icon_changed"}>
          <RenderMention
            userId={(props.systemMessage as ChannelEditSystemMessage).byId}
          />
          updated the group icon
        </Match>
        <Match when={props.systemMessage.type === "channel_ownership_changed"}>
          <RenderMention
            userId={
              (props.systemMessage as ChannelOwnershipChangeSystemMessage)
                .fromId
            }
          />
          transferred group ownership to
          <RenderMention
            userId={
              (props.systemMessage as ChannelOwnershipChangeSystemMessage).toId
            }
          />
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
