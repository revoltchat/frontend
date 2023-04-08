import {
  BiRegularHash,
  BiRegularPhoneCall,
  BiSolidChevronRight,
} from "solid-icons/bi";
import { For, Match, Show, Switch, createMemo, createSignal } from "solid-js";
import { styled } from "solid-styled-components";

import type { API, Channel, Server } from "revolt.js";

import { TextWithEmoji } from "@revolt/markdown";
import { Link } from "@revolt/routing";

import { ScrollContainer } from "../../common/ScrollContainers";
import { Header, HeaderWithImage } from "../../design/atoms/display/Header";
import { Typography } from "../../design/atoms/display/Typography";
import { MenuButton } from "../../design/atoms/inputs/MenuButton";
import { Column, OverflowingText, Row } from "../../design/layout";

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
}

/**
 * Ordered category data returned from server
 */
type CategoryData = Omit<API.Category, "channels"> & { channels: Channel[] };

/**
 * Display server information and channels
 */
export const ServerSidebar = (props: Props) => {
  return (
    <SidebarBase>
      <Switch
        fallback={
          <Header palette="secondary">
            <a onClick={props.openServerInfo}>
              <TextWithEmoji content={props.server.name} />
            </a>
          </Header>
        }
      >
        <Match when={props.server.banner}>
          <HeaderWithImage
            palette="secondary"
            style={{
              background: `url('${props.server.bannerURL}')`,
            }}
          >
            <a onClick={props.openServerInfo}>
              <TextWithEmoji content={props.server.name} />
            </a>
          </HeaderWithImage>
        </Match>
      </Switch>
      <ScrollContainer>
        <Column gap="lg">
          <div />
          <For each={props.server.orderedChannels}>
            {(category) => (
              <Category category={category} channelId={props.channelId} />
            )}
          </For>
          <div />
        </Column>
      </ScrollContainer>
    </SidebarBase>
  );
};

/**
 * Single category entry
 */
function Category(props: {
  category: CategoryData;
  channelId: string | undefined;
}) {
  const [shown, setShown] = createSignal(true);
  const channels = createMemo(() =>
    props.category.channels.filter(
      (channel) =>
        props.category.id === "default" ||
        shown() ||
        channel.unread ||
        channel.id === props.channelId
    )
  );

  return (
    <Column gap="sm">
      <Show when={props.category.id !== "default"}>
        <CategoryBase
          open={shown()}
          onClick={() => setShown(!shown())}
          align
          gap="sm"
        >
          <BiSolidChevronRight size={12} />
          <Typography variant="category">{props.category.title}</Typography>
        </CategoryBase>
      </Show>
      <For each={channels()}>
        {(channel) => (
          <Entry channel={channel} active={channel.id === props.channelId} />
        )}
      </For>
    </Column>
  );
}

/**
 * Category title styling
 */
const CategoryBase = styled(Row)<{ open: boolean }>`
  padding: 0 4px;
  cursor: pointer;
  user-select: none;
  text-transform: uppercase;
  transition: ${(props) => props.theme!.transitions.fast} all;

  color: ${(props) => props.theme!.colours["foreground-200"]};

  &:hover {
    filter: brightness(1.1);
  }

  &:active {
    filter: brightness(1.2);
  }

  svg {
    transition: ${(props) => props.theme!.transitions.fast} transform;
    transform: rotateZ(${(props) => (props.open ? 90 : 0)}deg);
  }
`;

/**
 * Server channel entry
 */
function Entry(props: { channel: Channel; active: boolean }) {
  return (
    <Link
      href={`/server/${props.channel.serverId}/channel/${props.channel.id}`}
    >
      <MenuButton
        size="thin"
        alert={
          !props.active &&
          props.channel.unread &&
          (props.channel.mentions.length || true)
        }
        attention={
          props.active ? "selected" : props.channel.unread ? "active" : "normal"
        }
        icon={
          <Switch fallback={<BiRegularHash size={24} />}>
            <Match when={props.channel.icon}>
              <ChannelIcon src={props.channel.smallIconURL} />
            </Match>
            <Match when={props.channel.type === "VoiceChannel"}>
              <BiRegularPhoneCall size={24} />
            </Match>
          </Switch>
        }
      >
        <OverflowingText>
          <TextWithEmoji content={props.channel.name!} />
        </OverflowingText>
      </MenuButton>
    </Link>
  );
}

/**
 * Channel icon styling
 */
const ChannelIcon = styled("img")`
  width: 24px;
  height: 24px;
  object-fit: contain;
`;
