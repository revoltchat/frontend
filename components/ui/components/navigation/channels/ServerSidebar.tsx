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
}

/**
 * Ordered category data returned from server
 */
type CategoryData = Omit<API.Category, "channels"> & { channels: Channel[] };

/**
 * Channel icon styling
 */
const ChannelIcon = styled("img")`
  width: 24px;
  height: 24px;
  object-fit: contain;
`;

/**
 * Server channel entry
 */
function Entry(props: { channel: Channel; active: boolean }) {
  return (
    <Link
      href={`/server/${props.channel.server_id}/channel/${props.channel._id}`}
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
              <ChannelIcon
                src={props.channel.generateIconURL({ max_side: 64 })}
              />
            </Match>
            <Match when={props.channel.channel_type === "VoiceChannel"}>
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
        channel._id === props.channelId
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
          <Entry channel={channel} active={channel._id === props.channelId} />
        )}
      </For>
    </Column>
  );
}

/**
 * Display server information and channels
 */
export const ServerSidebar = (props: Props) => {
  return (
    <SidebarBase>
      <Switch
        fallback={<Header palette="secondary">{props.server.name}</Header>}
      >
        <Match when={props.server.banner}>
          <HeaderWithImage
            palette="secondary"
            style={{
              background: `url('${props.server.generateBannerURL({
                max_side: 256,
              })}')`,
            }}
          >
            <div>
              <TextWithEmoji content={props.server.name} />
            </div>
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
