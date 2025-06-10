import {
  BiRegularCheckCircle,
  BiRegularHash,
  BiRegularPhoneCall,
  BiSolidCheckCircle,
  BiSolidCog,
} from "solid-icons/bi";
import { For, JSX, Match, Show, Switch, createMemo } from "solid-js";

import { useLingui } from "@lingui-solid/solid/macro";
import type { API, Channel, Server, ServerFlags } from "revolt.js";
import { styled } from "styled-system/jsx";

import { KeybindAction, createKeybind } from "@revolt/keybinds";
import { TextWithEmoji } from "@revolt/markdown";
import { useModals } from "@revolt/modal";
import { useNavigate } from "@revolt/routing";
import { useState } from "@revolt/state";
import {
  Column,
  Header,
  MenuButton,
  OverflowingText,
  Row,
  Tooltip,
  iconSize,
  typography,
} from "@revolt/ui";

import MdChevronRight from "@material-design-icons/svg/filled/chevron_right.svg?component-solid";
import MdPersonAdd from "@material-design-icons/svg/filled/person_add.svg?component-solid";
import MdSettings from "@material-design-icons/svg/filled/settings.svg?component-solid";

import { SidebarBase } from "./common";

interface Props {
  /**
   * Server to display sidebar for
   */
  server: Server;

  /**
   * Currently selected channel ID
   */
  channelId: string | undefined;

  /**
   * Open server information modal
   */
  openServerInfo: () => void;

  /**
   * Open server settings modal
   */
  openServerSettings: () => void;

  /**
   * Menu generator
   */
  menuGenerator: (target: Server | Channel) => JSX.Directives["floating"];
}

/**
 * Ordered category data returned from server
 */
type CategoryData = Omit<API.Category, "channels"> & { channels: Channel[] };

/**
 * Display server information and channels
 */
export const ServerSidebar = (props: Props) => {
  const navigate = useNavigate();

  // TODO: this does not filter visible channels at the moment because the state for categories is not stored anywhere
  /** Gets a list of channels that are currently not hidden inside a closed category */
  const visibleChannels = () =>
    props.server.orderedChannels.flatMap((category) => category.channels);

  // TODO: when navigating channels, we want to add aria-keyshortcuts={localized-shortcut} to the next/previous channels
  // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-keyshortcuts
  // TODO: issue warning if nothing is found somehow? warnings can be nicer than flat out not working
  // TODO: we want it to feel smooth when navigating through channels, so we'll want to select channels immediately but not actually navigate until we're done moving through them
  /** Navigates to the channel offset from the current one, wrapping around if needed */
  const navigateChannel = (byOffset: number) => {
    if (props.channelId == null) {
      return;
    }

    const channels = visibleChannels();

    const currentChannelIndex = channels.findIndex(
      (channel) => channel.id === props.channelId,
    );

    // this will wrap the index around
    const nextChannel = channels.at(
      (currentChannelIndex + byOffset) % channels.length,
    );

    if (nextChannel) {
      navigate(`/server/${props.server.id}/channel/${nextChannel.id}`);
    }
  };

  createKeybind(KeybindAction.NAVIGATION_CHANNEL_UP, () => navigateChannel(-1));

  createKeybind(KeybindAction.NAVIGATION_CHANNEL_DOWN, () =>
    navigateChannel(1),
  );

  createKeybind(KeybindAction.CHAT_MARK_SERVER_AS_READ, () => {
    if (props.server.unread) {
      props.server.ack();
    }
  });

  return (
    <SidebarBase>
      <Switch
        fallback={
          <Header placement="secondary">
            <ServerInfo
              server={props.server}
              openServerInfo={props.openServerInfo}
              openServerSettings={props.openServerSettings}
            />
          </Header>
        }
      >
        <Match when={props.server.banner}>
          <Header
            image
            placement="secondary"
            style={{
              background: `url('${props.server.bannerURL}')`,
            }}
          >
            <ServerInfo
              server={props.server}
              openServerInfo={props.openServerInfo}
              openServerSettings={props.openServerSettings}
            />
          </Header>
        </Match>
      </Switch>
      <div
        use:scrollable={{ showOnHover: true }}
        style={{ "flex-grow": 1 }}
        use:floating={props.menuGenerator(props.server)}
      >
        <List gap="lg">
          <div />
          <For each={props.server.orderedChannels}>
            {(category) => (
              <Category
                category={category}
                channelId={props.channelId}
                menuGenerator={props.menuGenerator}
              />
            )}
          </For>
          <div />
        </List>
      </div>
    </SidebarBase>
  );
};

/**
 * Server Information
 */
function ServerInfo(
  props: Pick<Props, "server" | "openServerInfo" | "openServerSettings">,
) {
  return (
    <Row align grow minWidth={0}>
      <ServerBadge flags={props.server.flags} />
      <ServerName onClick={props.openServerInfo}>
        <TextWithEmoji content={props.server.name} />
      </ServerName>
      <SettingsLink onClick={props.openServerSettings}>
        <BiSolidCog size={18} />
      </SettingsLink>
    </Row>
  );
}

/**
 * Server name
 */
const ServerName = styled("a", {
  base: {
    flexGrow: 1,
    minWidth: 0,

    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
});

/**
 * Settings link
 */
const SettingsLink = styled("a", {
  base: {
    cursor: "pointer",

    "& > *": {
      display: "block",
    },
  },
});

/**
 * Server badge
 */
function ServerBadge(props: { flags: ServerFlags }) {
  const { t } = useLingui();

  return (
    <Show when={props.flags}>
      <Tooltip
        content={props.flags === 1 ? t`Official Server` : t`Verified`}
        placement="top"
      >
        {props.flags === 1 ? (
          <BiSolidCheckCircle size={12} />
        ) : (
          <BiRegularCheckCircle size={12} />
        )}
      </Tooltip>
    </Show>
  );
}

/**
 * Single category entry
 */
function Category(
  props: {
    category: CategoryData;
    channelId: string | undefined;
  } & Pick<Props, "menuGenerator">,
) {
  const state = useState();

  const channels = createMemo(() =>
    props.category.channels.filter(
      (channel) =>
        props.category.id === "default" ||
        state.layout.getSectionState(props.category.id, true) ||
        channel.unread ||
        channel.id === props.channelId,
    ),
  );

  return (
    <Column gap="sm">
      <Show when={props.category.id !== "default"}>
        <CategoryBase
          open={state.layout.getSectionState(props.category.id, true)}
          onClick={() =>
            state.layout.toggleSectionState(props.category.id, true)
          }
        >
          <MdChevronRight {...iconSize(12)} />
          {props.category.title}
        </CategoryBase>
      </Show>
      <For each={channels()}>
        {(channel) => (
          <Entry
            channel={channel}
            active={channel.id === props.channelId}
            menuGenerator={props.menuGenerator}
          />
        )}
      </For>
    </Column>
  );
}

/**
 * Category title styling
 */
const CategoryBase = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    gap: "var(--gap-sm)",

    padding: "0 var(--gap-sm)",
    cursor: "pointer",
    userSelect: "none",
    textTransform: "uppercase",
    transition: "var(--transitions-fast) all",

    "--color": "var(--md-sys-color-outline)",
    color: "var(--color)",
    fill: "var(--color)",

    ...typography.raw({ class: "label", size: "small" }),

    "&:hover": {
      "--color": "var(--md-sys-color-on-surface-variant)",
    },

    "&:active": {
      "--color": "var(--md-sys-color-on-surface)",
    },

    "& svg": {
      transition: "var(--transitions-fast) transform",
    },
  },
  variants: {
    open: {
      true: {
        "& svg": {
          transform: "rotateZ(90deg)",
        },
      },
    },
  },
});

/**
 * Server channel entry
 */
function Entry(
  props: { channel: Channel; active: boolean } & Pick<Props, "menuGenerator">,
) {
  const { openModal } = useModals();

  return (
    <a href={`/server/${props.channel.serverId}/channel/${props.channel.id}`}>
      <MenuButton
        use:floating={props.menuGenerator(props.channel)}
        size="thin"
        alert={
          !props.active &&
          props.channel.unread &&
          (props.channel.mentions?.size || true)
        }
        attention={
          props.active ? "selected" : props.channel.unread ? "active" : "normal"
        }
        icon={
          <>
            <Switch fallback={<BiRegularHash size={20} />}>
              <Match when={props.channel.type === "VoiceChannel"}>
                <BiRegularPhoneCall size={20} />
              </Match>
            </Switch>
            <Show when={props.channel.icon}>
              <ChannelIcon src={props.channel.iconURL} />
            </Show>
          </>
        }
        actions={
          <>
            <a
              use:floating={{
                tooltip: {
                  placement: "top",
                  content: "Create Invite",
                },
              }}
              onClick={(e) => {
                e.preventDefault();
                openModal({
                  type: "create_invite",
                  channel: props.channel,
                });
              }}
            >
              <MdPersonAdd {...iconSize("14px")} />
            </a>

            <a
              use:floating={{
                tooltip: {
                  placement: "top",
                  content: "Edit Channel",
                },
              }}
              onClick={(e) => {
                e.preventDefault();
                openModal({
                  type: "settings",
                  config: "channel",
                  context: props.channel,
                });
              }}
            >
              <MdSettings {...iconSize("14px")} />
            </a>
          </>
        }
      >
        <OverflowingText>
          <TextWithEmoji content={props.channel.name!} />
        </OverflowingText>
      </MenuButton>
    </a>
  );
}

/**
 * Channel icon styling
 */
const ChannelIcon = styled("img", {
  base: {
    width: "16px",
    height: "16px",
    objectFit: "contain",
  },
});

/**
 * Inner scrollable list
 * We fix the width in order to prevent scrollbar from moving stuff around
 */
const List = styled(Column, {
  base: {
    width: "var(--layout-width-channel-sidebar)",
    paddingRight: "var(--gap-md)",
  },
});
