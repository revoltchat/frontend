import type { API, Channel, Server } from "revolt.js";

import { Link } from "@revolt/routing";
import { createMemo, createSignal, For, Match, Switch } from "solid-js";
import { Typography } from "../../design/atoms/display/Typography";
import { MenuButton } from "../../design/atoms/inputs/MenuButton";
import { Column, Row } from "../../design/layout";
import { SidebarBase } from "./common";
import {
  BiRegularHash,
  BiRegularPhoneCall,
  BiSolidChevronDown,
  BiSolidChevronRight,
} from "solid-icons/bi";
import { styled } from "solid-styled-components";
import { Header, HeaderWithImage } from "../../design/atoms/display/Header";
import { ScrollContainer } from "../../common/ScrollContainers";

interface Props {
  server: () => Server;
  channelId: () => string | undefined;
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
function Entry({
  channel,
  active,
}: {
  channel: Channel;
  active: () => boolean;
}) {
  return (
    <Link href={`/server/${channel.server_id}/channel/${channel._id}`}>
      <MenuButton
        size="thin"
        alert={!active() && channel.unread && (channel.mentions.length || true)}
        attention={active() ? "selected" : channel.unread ? "active" : "normal"}
        icon={
          <Switch fallback={<BiRegularHash size={24} />}>
            <Match when={channel.icon}>
              <ChannelIcon src={channel.generateIconURL({ max_side: 64 })} />
            </Match>
            <Match when={channel.channel_type === "VoiceChannel"}>
              <BiRegularPhoneCall size={24} />
            </Match>
          </Switch>
        }
      >
        {channel.name}
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
function Category({
  category,
  channelId,
}: {
  category: CategoryData;
  channelId: () => string | undefined;
}) {
  const [shown, setShown] = createSignal(true);
  const channels = createMemo(() =>
    category.channels.filter(
      (channel) => shown() || channel.unread || channel._id === channelId()
    )
  );

  return (
    <Column gap="sm">
      <CategoryBase
        open={shown()}
        onClick={() => setShown(!shown())}
        align
        gap="sm"
      >
        <BiSolidChevronRight size={12} />
        <Typography variant="small">{category.title}</Typography>
      </CategoryBase>
      <For each={channels()}>
        {(channel) => (
          <Entry channel={channel} active={() => channel._id === channelId()} />
        )}
      </For>
    </Column>
  );
}

/**
 * Display server information and channels
 */
export const ServerSidebar = ({ server, channelId }: Props) => {
  return (
    <SidebarBase>
      <Switch fallback={<Header palette="secondary">{server().name}</Header>}>
        <Match when={server().banner}>
          <HeaderWithImage
            palette="secondary"
            style={{
              background: `url('${server().generateBannerURL({
                max_side: 256,
              })}')`,
            }}
          >
            <div>{server().name}</div>
          </HeaderWithImage>
        </Match>
      </Switch>
      <ScrollContainer>
        <Column gap="lg">
          <div />
          <For each={server().orderedChannels}>
            {(category) => (
              <Category category={category} channelId={channelId} />
            )}
          </For>
          <div />
        </Column>
      </ScrollContainer>
    </SidebarBase>
  );
};
