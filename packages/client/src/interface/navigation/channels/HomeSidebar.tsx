import { BiSolidHome, BiSolidNotepad, BiSolidUserDetail } from "solid-icons/bi";
import { Match, Show, Switch, createMemo, splitProps } from "solid-js";

import { Plural, Trans, useLingui } from "@lingui-solid/solid/macro";
import { VirtualContainer } from "@minht11/solid-virtual-container";
import { Channel } from "revolt.js";
import { styled } from "styled-system/jsx";

import { ChannelContextMenu, UserContextMenu } from "@revolt/app";
import { useClient } from "@revolt/client";
import { TextWithEmoji } from "@revolt/markdown";
import { useModals } from "@revolt/modal";
import { useLocation, useNavigate } from "@revolt/routing";
import { iconSize } from "@revolt/ui";
import {
  Avatar,
  Deferred,
  MenuButton,
  OverflowingText,
  Tooltip,
  UserStatus,
  typography,
} from "@revolt/ui";

import MdPlus from "@material-design-icons/svg/outlined/add.svg?component-solid";
import MdClose from "@material-design-icons/svg/outlined/close.svg?component-solid";

import { SidebarBase } from "./common";

interface Props {
  /**
   * Ordered list of conversations
   */
  conversations: () => Channel[];

  /**
   * Current channel ID
   */
  channelId?: string;

  /**
   * Open the saved notes channel
   */
  openSavedNotes: (
    navigate?: ReturnType<typeof useNavigate>,
  ) => string | undefined;
}

/**
 * Display home navigation and conversations
 */
export const HomeSidebar = (props: Props) => {
  const { t } = useLingui();
  const client = useClient();
  const navigate = useNavigate();
  const location = useLocation();
  const { openModal } = useModals();

  const savedNotesChannelId = createMemo(() => props.openSavedNotes());

  let scrollTargetElement!: HTMLDivElement;

  return (
    <SidebarBase>
      <div
        ref={scrollTargetElement}
        use:scrollable={{ direction: "y", showOnHover: true }}
      >
        <List>
          <SidebarTitle>
            <Trans>Conversations</Trans>
          </SidebarTitle>

          <a href="/app">
            <MenuButton
              size="normal"
              icon={<BiSolidHome size={24} />}
              attention={location.pathname === "/app" ? "selected" : "normal"}
            >
              <ButtonTitle>
                <Trans>Home</Trans>
              </ButtonTitle>
            </MenuButton>
          </a>

          <a href="/friends">
            <MenuButton
              size="normal"
              icon={<BiSolidUserDetail size={24} />}
              attention={
                location.pathname === "/friends" ? "selected" : "normal"
              }
            >
              <ButtonTitle>
                <Trans>Friends</Trans>
              </ButtonTitle>
            </MenuButton>
          </a>

          <Switch
            fallback={
              <MenuButton
                size="normal"
                attention={"normal"}
                icon={<BiSolidNotepad size={24} />}
                onClick={() => props.openSavedNotes(navigate)}
              >
                <ButtonTitle>
                  <Trans>Saved Notes</Trans>
                </ButtonTitle>
              </MenuButton>
            }
          >
            <Match when={savedNotesChannelId()}>
              <a href={`/channel/${savedNotesChannelId()}`}>
                <MenuButton
                  size="normal"
                  icon={<BiSolidNotepad size={24} />}
                  attention={
                    props.channelId && savedNotesChannelId() === props.channelId
                      ? "selected"
                      : "normal"
                  }
                >
                  <ButtonTitle>
                    <Trans>Saved Notes</Trans>
                  </ButtonTitle>
                </MenuButton>
              </a>
            </Match>
          </Switch>

          <Category>
            Direct Messages
            <a
              onClick={() =>
                openModal({
                  type: "create_group",
                  client: client(),
                })
              }
              use:floating={{
                tooltip: {
                  placement: "right",
                  content: t`Create a new group`,
                },
              }}
            >
              <MdPlus {...iconSize(14)} />
            </a>
          </Category>

          <Deferred>
            <VirtualContainer
              items={props.conversations()}
              scrollTarget={scrollTargetElement}
              itemSize={{ height: 48 }}
            >
              {(item) => (
                <div
                  style={{
                    ...item.style,
                    width: "100%",
                    "padding-block": "3px",
                  }}
                >
                  <Entry
                    // @ts-expect-error missing type on Entry
                    role="listitem"
                    tabIndex={item.tabIndex}
                    style={item.style}
                    channel={item.item}
                    active={item.item.id === props.channelId}
                  />
                </div>
              )}
            </VirtualContainer>
          </Deferred>
        </List>
      </div>
    </SidebarBase>
  );
};

/**
 * Sidebar title
 */
const SidebarTitle = styled("p", {
  base: {
    paddingBlock: "var(--gap-md)",
    paddingInline: "var(--gap-lg)",

    ...typography.raw({ class: "title" }),
  },
});

/**
 * Button title
 */
const ButtonTitle = styled("div", {
  base: {
    height: "100%",
    display: "flex",
    alignItems: "center",
  },
});

const Category = styled("div", {
  base: {
    display: "flex",
    paddingTop: "var(--gap-md)",
    paddingInline: "var(--gap-lg)",
    alignItems: "center",
    justifyContent: "space-between",

    ...typography.raw({ class: "label", size: "small" }),
  },
});

/**
 * Styles required to correctly display name and status
 */
const NameStatusStack = styled("div", {
  base: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
});

/**
 * Single conversation entry
 */
function Entry(
  props: { channel: Channel; active: boolean } /*& Omit<
    ComponentProps<typeof Link>,
    "href"
  >*/,
) {
  const [local, remote] = splitProps(props, ["channel", "active"]);

  const { t } = useLingui();
  const { openModal } = useModals();

  /**
   * Determine user status if present
   */
  const status = () =>
    local.channel.recipient?.statusMessage((s) =>
      s === "Online"
        ? t`Online`
        : s === "Busy"
          ? t`Busy`
          : s === "Focus"
            ? t`Focus`
            : s === "Idle"
              ? t`Idle`
              : t`Offline`,
    );

  return (
    <a {...remote} href={`/channel/${local.channel.id}`}>
      <MenuButton
        size="normal"
        alert={
          !local.active &&
          local.channel.unread &&
          (local.channel.mentions?.size || true)
        }
        attention={
          local.active ? "selected" : local.channel.unread ? "active" : "normal"
        }
        icon={
          <Switch>
            <Match when={local.channel.type === "Group"}>
              <Avatar
                size={32}
                shape="rounded-square"
                fallback={local.channel.name}
                src={local.channel.iconURL}
                primaryContrast
              />
            </Match>
            <Match when={local.channel.type === "DirectMessage"}>
              <Avatar
                size={32}
                src={local.channel.iconURL}
                holepunch="bottom-right"
                overlay={
                  <UserStatus.Graphic
                    status={local.channel?.recipient?.presence}
                  />
                }
              />
            </Match>
          </Switch>
        }
        actions={
          <a
            onClick={(e) => {
              e.preventDefault();
              openModal({
                type: "delete_channel",
                channel: local.channel,
              });
            }}
          >
            <MdClose {...iconSize("18px")} />
          </a>
        }
        use:floating={{
          contextMenu: () =>
            local.channel.type === "DirectMessage" ? (
              <UserContextMenu
                user={local.channel.recipient!}
                channel={local.channel}
              />
            ) : (
              <ChannelContextMenu channel={local.channel} />
            ),
        }}
      >
        <NameStatusStack>
          <Switch>
            <Match when={local.channel.type === "Group"}>
              <OverflowingText>
                <TextWithEmoji content={local.channel.name!} />
              </OverflowingText>
              <span class={typography({ class: "_status" })}>
                <Plural
                  value={local.channel.recipientIds.size}
                  one="# Member"
                  other="# Members"
                />
              </span>
            </Match>
            <Match when={local.channel.type === "DirectMessage"}>
              <OverflowingText>
                {local.channel?.recipient?.displayName}
              </OverflowingText>
              <Show when={status()}>
                <Tooltip
                  content={() => <TextWithEmoji content={status()!} />}
                  placement="top-start"
                  aria={status()!}
                >
                  <OverflowingText class={typography({ class: "_status" })}>
                    <TextWithEmoji content={status()!} />
                  </OverflowingText>
                </Tooltip>
              </Show>
            </Match>
          </Switch>
        </NameStatusStack>
      </MenuButton>
    </a>
  );
}

/**
 * Inner scrollable list
 * We fix the width in order to prevent scrollbar from moving stuff around
 */
const List = styled("div", {
  base: {
    paddingRight: "var(--gap-md)",
    width: "var(--layout-width-channel-sidebar)",
  },
});
