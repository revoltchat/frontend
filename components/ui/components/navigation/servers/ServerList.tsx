import { BiSolidCheckShield, BiSolidCog } from "solid-icons/bi";
import { Accessor, For, Show, onMount } from "solid-js";
import { styled } from "solid-styled-components";

import { Channel, Server, User } from "revolt.js";

import { KeybindAction } from "@revolt/keybinds";
import { Link, useNavigate } from "@revolt/routing";

import { invisibleScrollable } from "../../../directives";
import { Draggable } from "../../common/Draggable";
import { useKeybinds } from "../../context/Keybinds";
import { Button, Column, Typography } from "../../design";
import { Avatar } from "../../design/atoms/display/Avatar";
import {
  UnreadsGraphic,
  UserStatusGraphic,
} from "../../design/atoms/indicators";
import { Tooltip } from "../../floating";

import { Swoosh } from "./Swoosh";

invisibleScrollable;

interface Props {
  /**
   * Ordered server list
   */
  orderedServers: Server[];

  /**
   * Set server ordering
   * @param ids List of IDs
   */
  setServerOrder: (ids: string[]) => void;

  /**
   * Unread conversations list
   */
  unreadConversations: Channel[];

  /**
   * Current logged in user
   */
  user: User;

  /**
   * Selected server id
   */
  selectedServer: Accessor<string | undefined>;
}

/**
 * Server list sidebar component
 */
export const ServerList = (props: Props) => {
  const navigate = useNavigate();
  const keybinds = useKeybinds();

  const navigateServer = (byOffset: number) => {
    let serverId = props.selectedServer();
    if (serverId == null) {
      return;
    }

    const currentServerIndex = props.orderedServers.findIndex(
      (server) => server.id === serverId
    );

    let nextIndex = currentServerIndex + byOffset;

    if (nextIndex === -1) {
      return navigate("/app");
    }

    // this will wrap the index around
    const nextChannel = props.orderedServers.at(
      nextIndex % props.orderedServers.length
    );

    if (nextChannel) {
      navigate(`/server/${serverId}`);
    }
  };

  onMount(() => {
    keybinds.addEventListener(KeybindAction.NavigateServerUp, (e) => {
      navigateServer(-1);
    });
  });

  return (
    <ServerListBase>
      <div use:invisibleScrollable={{ direction: "y" }}>
        <Tooltip
          placement="right"
          content={() => (
            <Column gap="none">
              <span>{props.user.username}</span>
              <Typography variant="small">{props.user.presence}</Typography>
            </Column>
          )}
          aria={props.user.username}
        >
          <EntryContainer>
            <Show when={!props.selectedServer()}>
              <PositionSwoosh>
                <Swoosh />
              </PositionSwoosh>
            </Show>
            <Link href="/">
              <Avatar
                size={42}
                src={props.user.avatarURL}
                holepunch={"bottom-right"}
                overlay={<UserStatusGraphic status={props.user.presence} />}
                interactive
              />
            </Link>
          </EntryContainer>
        </Tooltip>
        <Show when={props.user.privileged}>
          <EntryContainer>
            <Link href="/admin">
              <Button compact="icon">
                <BiSolidCheckShield size={32} />
              </Button>
            </Link>
          </EntryContainer>
        </Show>
        <For each={props.unreadConversations.slice(0, 9)}>
          {(conversation) => (
            <Tooltip placement="right" content={conversation.displayName}>
              <EntryContainer>
                <Link href={`/channel/${conversation.id}`}>
                  <Avatar
                    size={42}
                    // TODO: fix this
                    src={conversation.iconURL}
                    holepunch={conversation.unread ? "top-right" : "none"}
                    overlay={
                      <>
                        <Show when={conversation.unread}>
                          <UnreadsGraphic
                            count={conversation.mentions?.size ?? 0}
                            unread
                          />
                        </Show>
                      </>
                    }
                    fallback={
                      conversation.name ?? conversation.recipient?.username
                    }
                    interactive
                  />
                </Link>
              </EntryContainer>
            </Tooltip>
          )}
        </For>
        <Show when={props.unreadConversations.length > 9}>
          <EntryContainer>
            <Link href={`/`}>
              <Avatar
                size={42}
                fallback={<>+{props.unreadConversations.length - 9}</>}
              />
            </Link>
          </EntryContainer>
        </Show>
        <LineDivider />
        <Draggable items={props.orderedServers} onChange={props.setServerOrder}>
          {(item) => (
            <Tooltip placement="right" content={item.name}>
              <EntryContainer>
                <Show when={props.selectedServer() === item.id}>
                  <PositionSwoosh>
                    <Swoosh />
                  </PositionSwoosh>
                </Show>
                <Link href={`/server/${item.id}`}>
                  <Avatar
                    size={42}
                    src={item.iconURL}
                    holepunch={item.unread ? "top-right" : "none"}
                    overlay={
                      <>
                        <Show when={item.unread}>
                          <UnreadsGraphic count={item.mentions.length} unread />
                        </Show>
                      </>
                    }
                    fallback={item.name}
                    interactive
                  />
                </Link>
              </EntryContainer>
            </Tooltip>
          )}
        </Draggable>
      </div>
      <Shadow>
        <div />
      </Shadow>
      <Tooltip placement="right" content="Settings">
        <EntryContainer>
          <Link href="/settings">
            <Avatar size={42} fallback={<BiSolidCog size={18} />} interactive />
          </Link>
        </EntryContainer>
      </Tooltip>
    </ServerListBase>
  );
};

/**
 * Server list container
 */
const ServerListBase = styled("div", "ServerList")`
  display: flex;
  flex-direction: column;

  background: ${({ theme }) => theme!.colours["background"]};
`;

/**
 * Server entries
 */
const EntryContainer = styled("div", "Entry")`
  width: 56px;
  height: 56px;
  position: relative;
  display: grid;
  flex-shrink: 0;
  place-items: center;

  a {
    z-index: 1;
  }
`;

/**
 * Divider line between two lists
 */
const LineDivider = styled.div`
  height: 1px;
  flex-shrink: 0;
  margin: 6px auto;
  width: calc(100% - 24px);
  background: ${({ theme }) => theme!.colours["background-300"]};
`;

/**
 * Position the Swoosh correctly
 */
const PositionSwoosh = styled.div`
  user-select: none;
  position: absolute;
  pointer-events: none;
`;

/**
 * Shadow at the bottom of the list
 */
const Shadow = styled("div", "Shadow")`
  height: 0;
  z-index: 1;
  display: relative;

  div {
    height: 12px;
    margin-top: -12px;
    display: absolute;
    background: linear-gradient(
      to bottom,
      transparent,
      ${(props) => props.theme!.colours["background"]}
    );
  }
`;
