import { Accessor, For, Show, onCleanup, onMount } from "solid-js";
import { JSX } from "solid-js";

import { Channel, Server, User } from "revolt.js";
import { cva } from "styled-system/css";
import { styled } from "styled-system/jsx";

import { KeybindAction } from "@revolt/keybinds";
import { modalController } from "@revolt/modal";
import { useNavigate } from "@revolt/routing";

import MdAdd from "@material-design-icons/svg/filled/add.svg?component-solid";
import MdExplore from "@material-design-icons/svg/filled/explore.svg?component-solid";
import MdHome from "@material-design-icons/svg/filled/home.svg?component-solid";
import MdSettings from "@material-design-icons/svg/filled/settings.svg?component-solid";

import { Draggable } from "../../common/Draggable";
import { useKeybindActions } from "../../context/Keybinds";
import { Column, Typography } from "../../design";
import { Avatar } from "../../design/atoms/display/Avatar";
import {
  UnreadsGraphic,
  UserStatusGraphic,
} from "../../design/atoms/indicators";
import { Tooltip } from "../../floating";

import { Swoosh } from "./Swoosh";

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

  /**
   * Create or join server
   */
  onCreateOrJoinServer(): void;

  /**
   * Menu generator
   */
  menuGenerator: (target: Server | Channel) => JSX.Directives["floating"];
}

/**
 * Server list sidebar component
 */
export const ServerList = (props: Props) => {
  const navigate = useNavigate();
  const keybinds = useKeybindActions();

  const navigateServer = (ev: KeyboardEvent, byOffset: number) => {
    ev.preventDefault();

    const serverId = props.selectedServer();
    if (serverId == null && props.orderedServers.length) {
      if (byOffset === 1) {
        navigate(`/server/${props.orderedServers[0].id}`);
      } else {
        navigate(
          `/server/${props.orderedServers[props.orderedServers.length - 1].id}`,
        );
      }
      return;
    }

    const currentServerIndex = props.orderedServers.findIndex(
      (server) => server.id === serverId,
    );

    const nextIndex = currentServerIndex + byOffset;

    if (nextIndex === -1) {
      return navigate("/app");
    }

    // this will wrap the index around
    const nextServer = props.orderedServers.at(
      nextIndex % props.orderedServers.length,
    );

    if (nextServer) {
      navigate(`/server/${nextServer.id}`);
    }
  };

  const navigateServerUp = (ev: KeyboardEvent) => navigateServer(ev, -1);
  const navigateServerDown = (ev: KeyboardEvent) => navigateServer(ev, 1);

  onMount(() => {
    keybinds.addEventListener(KeybindAction.NavigateServerUp, navigateServerUp);
    keybinds.addEventListener(
      KeybindAction.NavigateServerDown,
      navigateServerDown,
    );
  });

  onCleanup(() => {
    keybinds.removeEventListener(
      KeybindAction.NavigateServerUp,
      navigateServerUp,
    );
    keybinds.removeEventListener(
      KeybindAction.NavigateServerDown,
      navigateServerDown,
    );
  });

  return (
    <ServerListBase>
      <div use:invisibleScrollable={{ direction: "y", class: listBase() }}>
        {/* <Show when={!props.selectedServer()}>
            <PositionSwoosh>
              <Swoosh topItem />
            </PositionSwoosh>
          </Show> */}
        <a class={entryContainer()} href="/app">
          <Avatar size={42} fallback={<MdHome />} />
        </a>
        <Tooltip
          placement="right"
          content={() => (
            <Column>
              <span>{props.user.username}</span>
              <Typography variant="small">{props.user.presence}</Typography>
            </Column>
          )}
          aria={props.user.username}
        >
          {/* TODO: Make this open user status context menu */}
          <a class={entryContainer()} href="/app">
            <Avatar
              size={42}
              src={props.user.avatarURL}
              holepunch={"bottom-right"}
              overlay={<UserStatusGraphic status={props.user.presence} />}
              interactive
            />
          </a>
        </Tooltip>
        <For each={props.unreadConversations.slice(0, 9)}>
          {(conversation) => (
            <Tooltip placement="right" content={conversation.displayName}>
              <a
                class={entryContainer()}
                use:floating={props.menuGenerator(conversation)}
                href={`/channel/${conversation.id}`}
              >
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
              </a>
            </Tooltip>
          )}
        </For>
        <Show when={props.unreadConversations.length > 9}>
          <a class={entryContainer()} href={`/`}>
            <Avatar
              size={42}
              fallback={<>+{props.unreadConversations.length - 9}</>}
            />
          </a>
        </Show>
        <LineDivider />
        <Draggable items={props.orderedServers} onChange={props.setServerOrder}>
          {(item) => (
            <Show
              when={
                item.$exists /** reactivity lags behind here for some reason,
                                 just check existence before continuing */
                // TODO: check if still an issue
              }
            >
              <Tooltip placement="right" content={item.name}>
                <div
                  class={entryContainer()}
                  use:floating={props.menuGenerator(item)}
                >
                  <Show when={props.selectedServer() === item.id}>
                    <PositionSwoosh>
                      <Swoosh />
                    </PositionSwoosh>
                  </Show>
                  <a href={`/server/${item.id}`}>
                    <Avatar
                      size={42}
                      src={item.iconURL}
                      holepunch={item.unread ? "top-right" : "none"}
                      overlay={
                        <>
                          <Show when={item.unread}>
                            <UnreadsGraphic
                              count={item.mentions.length}
                              unread
                            />
                          </Show>
                        </>
                      }
                      fallback={item.name}
                      interactive
                    />
                  </a>
                </div>
              </Tooltip>
            </Show>
          )}
        </Draggable>
        <Tooltip placement="right" content={"Create or join a server"}>
          <a
            class={entryContainer()}
            onClick={() => props.onCreateOrJoinServer()}
          >
            <Avatar size={42} fallback={<MdAdd />} />
          </a>
        </Tooltip>
        <Tooltip placement="right" content={"Find new servers to join"}>
          <div class={entryContainer()}>
            <Avatar size={42} fallback={<MdExplore />} />
          </div>
        </Tooltip>
      </div>
      <Shadow>
        <div />
      </Shadow>
      <Tooltip placement="right" content="Settings">
        <a
          class={entryContainer()}
          onClick={() => {
            console.info("[DEBUG] (1) Pushing to modal controller!");
            modalController.push({ type: "settings", config: "user" });
          }}
        >
          <Avatar size={42} fallback={<MdSettings />} interactive />
        </a>
      </Tooltip>
    </ServerListBase>
  );
};

/**
 * Server list container
 */
const ServerListBase = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",

    fill: "var(--md-sys-color-on-surface)",
  },
});

/**
 * Container around list of servers
 */
const listBase = cva({
  base: {
    flexGrow: 1,
  },
});

/**
 * Server entries
 */
const entryContainer = cva({
  base: {
    width: "56px",
    height: "56px",
    position: "relative",
    display: "grid",
    flexShrink: 0,
    placeItems: "center",
  },
});

/**
 * Divider line between two lists
 */
const LineDivider = styled("div", {
  base: {
    height: "1px",
    flexShrink: 0,
    margin: "6px auto",
    width: "calc(100% - 24px)",
    background: "var(--colours-sidebar-server-list-foreground)",
  },
});

/**
 * Position the Swoosh correctly
 */
const PositionSwoosh = styled("div", {
  base: {
    userSelect: "none",
    position: "absolute",
    pointerEvents: "none",
    height: 0,
    zIndex: -1,
    marginTop: "-106px",
  },
});

/**
 * Shadow at the bottom of the list
 */
const Shadow = styled("div", {
  base: {
    height: 0,
    zIndex: 1,
    position: "relative",

    "& div": {
      height: "12px",
      marginTop: "-12px",
      position: "absolute",
      background:
        "linear-gradient(to bottom, transparent, var(--md-sys-color-surface-container-highest))",
    },
  },
});
