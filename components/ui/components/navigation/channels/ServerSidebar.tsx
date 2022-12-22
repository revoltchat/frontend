import type { API, Channel, Server } from "revolt.js";

import { Link } from "@revolt/routing";
import { createMemo, createSignal, For, Match, Show, Switch } from "solid-js";
import { Typography } from "../../design/atoms/display/Typography";
import { MenuButton } from "../../design/atoms/inputs/MenuButton";
import { Column, Row } from "../../design/layout";
import { SidebarBase } from "./common";
import {
  BiRegularHash,
  BiRegularPhoneCall,
  BiSolidChevronRight,
} from "solid-icons/bi";
import { styled } from "solid-styled-components";
import { Header, HeaderWithImage } from "../../design/atoms/display/Header";
import { ScrollContainer } from "../../common/ScrollContainers";

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
        {props.channel.name}
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

  color: ${(props) => props.theme!.colours["foreground-200"]};

  &:hover {
    color: ${(props) => props.theme!.colours["foreground-100"]};
  }

  &:active {
    color: ${(props) => props.theme!.colours["foreground"]};
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
          <Typography variant="small">{props.category.title}</Typography>
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
            <div>{props.server.name}</div>
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
