import { Match, Switch } from "solid-js";
import { styled } from "solid-styled-components";

import {
  ChannelEditSystemMessage,
  ChannelOwnershipChangeSystemMessage,
  ChannelRenamedSystemMessage,
  SystemMessage as SystemMessageClass,
  UserModeratedSystemMessage,
  UserSystemMessage,
} from "revolt.js";

import { Typography } from "../../design";

interface Props {
  /**
   * System Message
   */
  systemMessage: SystemMessageClass;

  /**
   * Whether this is rendered within a server
   */
  isServer: boolean;
}

/**
 * System Message
 */
export function SystemMessage(props: Props) {
  // TODO: i18n with components
  return (
    <Base>
      <Typography variant="system-message">
        <Switch fallback={props.systemMessage.type}>
          <Match when={props.systemMessage.type === "user_added"}>
            <Username>
              {
                (props.systemMessage as UserModeratedSystemMessage).user
                  ?.username
              }
            </Username>{" "}
            has been added by{" "}
            <Username>
              {(props.systemMessage as UserModeratedSystemMessage).by?.username}
            </Username>
          </Match>
          <Match
            when={props.systemMessage.type === "user_left" && !props.isServer}
          >
            <Username>
              {(props.systemMessage as UserSystemMessage).user?.username}
            </Username>{" "}
            left the group
          </Match>
          <Match when={props.systemMessage.type === "user_remove"}>
            <Username>
              {
                (props.systemMessage as UserModeratedSystemMessage).user
                  ?.username
              }
            </Username>{" "}
            has been removed by{" "}
            <Username>
              {(props.systemMessage as UserModeratedSystemMessage).by?.username}
            </Username>
          </Match>
          <Match when={props.systemMessage.type === "user_kicked"}>
            <Username>
              {(props.systemMessage as UserSystemMessage).user?.username}
            </Username>{" "}
            has been kicked from the server
          </Match>
          <Match when={props.systemMessage.type === "user_banned"}>
            <Username>
              {(props.systemMessage as UserSystemMessage).user?.username}
            </Username>{" "}
            has been banned from the server
          </Match>
          <Match when={props.systemMessage.type === "user_joined"}>
            <Username>
              {(props.systemMessage as UserSystemMessage).user?.username}
            </Username>{" "}
            joined the server
          </Match>
          <Match
            when={props.systemMessage.type === "user_left" && props.isServer}
          >
            <Username>
              {(props.systemMessage as UserSystemMessage).user?.username}
            </Username>{" "}
            left the server
          </Match>
          <Match when={props.systemMessage.type === "channel_renamed"}>
            <Username>
              {
                (props.systemMessage as ChannelRenamedSystemMessage).by
                  ?.username
              }
            </Username>{" "}
            updated the group name to{" "}
            <Username>
              {(props.systemMessage as ChannelRenamedSystemMessage).name}
            </Username>
          </Match>
          <Match
            when={props.systemMessage.type === "channel_description_changed"}
          >
            <Username>
              {(props.systemMessage as ChannelEditSystemMessage).by?.username}
            </Username>{" "}
            updated the group description
          </Match>
          <Match when={props.systemMessage.type === "channel_icon_changed"}>
            <Username>
              {(props.systemMessage as ChannelEditSystemMessage).by?.username}
            </Username>{" "}
            updated the group icon
          </Match>
          <Match
            when={props.systemMessage.type === "channel_ownership_changed"}
          >
            <Username>
              {
                (props.systemMessage as ChannelOwnershipChangeSystemMessage)
                  .from?.username
              }
            </Username>{" "}
            transferred group ownership to{" "}
            <Username>
              {
                (props.systemMessage as ChannelOwnershipChangeSystemMessage).to
                  ?.username
              }
            </Username>
          </Match>
        </Switch>
      </Typography>
    </Base>
  );
}

const Base = styled("div", "SystemMessage")`
  color: ${(props) => props.theme!.colours["foreground-400"]};
`;

const Username = styled.span`
  color: ${(props) => props.theme!.colours["foreground"]};
`;
