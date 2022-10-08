import { Link } from "@revolt/routing";
import { Channel } from "revolt.js";
import { For, Match, Show, Switch } from "solid-js";
import { Avatar } from "../../design/atoms/display/Avatar";
import { Typography } from "../../design/atoms/display/Typography";
import { UserStatus } from "../../design/atoms/indicators";
import { MenuButton } from "../../design/atoms/inputs/MenuButton";
import { Column } from "../../design/layout";
import { OverflowingText } from "../../design/layout/OverflowingText";
import { SidebarBase } from "./common";
import { useQuantity } from "@revolt/i18n";
import { ScrollContainer } from "../../common/ScrollContainers";

interface Props {
  /**
   * Ordered list of conversations
   */
  conversations: () => Channel[];

  /**
   * Current channel ID
   */
  channelId: () => string;
}

/**
 * Single conversation entry
 */
function Entry({
  channel,
  active,
}: {
  channel: Channel;
  active: () => boolean;
}) {
  const q = useQuantity();
  const dm = channel.recipient;

  return (
    <Link href={`/channel/${channel._id}`}>
      <MenuButton
        size="normal"
        alert={!active() && channel.unread && (channel.mentions.length || true)}
        attention={active() ? "selected" : channel.unread ? "active" : "normal"}
        icon={
          <Switch>
            <Match when={channel.channel_type === "Group"}>
              <Avatar
                size={32}
                fallback={channel.name}
                src={channel.generateIconURL({ max_side: 256 })}
              />
            </Match>
            <Match when={channel.channel_type === "DirectMessage"}>
              <Avatar
                size={32}
                src={
                  dm?.generateAvatarURL({ max_side: 256 }) ??
                  dm?.defaultAvatarURL
                }
                holepunch="bottom-right"
                overlay={
                  <UserStatus status={dm?.status?.presence ?? "Invisible"} />
                }
              />
            </Match>
          </Switch>
        }
      >
        <Column gap="none">
          <Switch>
            <Match when={channel.channel_type === "Group"}>
              <OverflowingText>{channel.name}</OverflowingText>
              <Typography variant="subtitle">
                {q("members", channel.recipient_ids?.length || 0)}
              </Typography>
            </Match>
            <Match when={channel.channel_type === "DirectMessage"}>
              <OverflowingText>{dm?.username}</OverflowingText>
              <Show when={dm?.status?.text || dm?.status?.presence === "Focus"}>
                <Typography variant="subtitle">
                  <OverflowingText>
                    {dm?.status?.text || dm?.status?.presence === "Focus"}
                  </OverflowingText>
                </Typography>
              </Show>
            </Match>
          </Switch>
        </Column>
      </MenuButton>
    </Link>
  );
}

/**
 * Display home navigation and conversations
 */
export const HomeSidebar = ({ conversations, channelId }: Props) => {
  return (
    <SidebarBase>
      <p>
        <Typography variant="h1">Conversations</Typography>
      </p>
      <ScrollContainer>
        <Column>
          <div />
          <For each={conversations()}>
            {(channel) => (
              <Entry
                channel={channel}
                active={() => channel._id === channelId()}
              />
            )}
          </For>
          <div />
        </Column>
      </ScrollContainer>
    </SidebarBase>
  );
};
