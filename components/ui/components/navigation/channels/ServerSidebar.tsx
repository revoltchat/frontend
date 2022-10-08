import type { API, Channel, Server } from "revolt.js";

import { Link } from "@revolt/routing";
import { createMemo, createSignal, For, Match, Switch } from "solid-js";
import { Typography } from "../../design/atoms/display/Typography";
import { MenuButton } from "../../design/atoms/inputs/MenuButton";
import { Column } from "../../design/layout";
import { SidebarBase } from "./common";
import { BiRegularHash, BiRegularPhoneCall } from "solid-icons/bi";
import { styled } from "solid-styled-components";

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
        alert={channel.unread && (channel.mentions.length || true)}
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
      <Typography variant="h3" onClick={() => setShown(!shown())}>
        {category.title}
      </Typography>
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
      <Column gap="lg">
        <Typography variant="h2">{server().name}</Typography>
        <For each={server().orderedChannels}>
          {(category) => <Category category={category} channelId={channelId} />}
        </For>
      </Column>
    </SidebarBase>
  );
};
