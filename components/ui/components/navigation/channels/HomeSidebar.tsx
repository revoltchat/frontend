import { Link, useLocation, useNavigate } from "@revolt/routing";
import { Channel } from "revolt.js";
import { For, Match, Show, Switch } from "solid-js";
import { Avatar } from "../../design/atoms/display/Avatar";
import { Typography } from "../../design/atoms/display/Typography";
import { UserStatusGraphic } from "../../design/atoms/indicators";
import { MenuButton } from "../../design/atoms/inputs/MenuButton";
import { Column } from "../../design/layout";
import { OverflowingText } from "../../design/layout/OverflowingText";
import { SidebarBase } from "./common";
import { useQuantity, useTranslation } from "@revolt/i18n";
import { ScrollContainer } from "../../common/ScrollContainers";
import { TextWithEmoji } from "@revolt/markdown";
import { BiSolidHome, BiSolidNotepad, BiSolidUserDetail } from "solid-icons/bi";
import { styled } from "solid-styled-components";
import { Tooltip } from "../../floating";

interface Props {
  /**
   * Ordered list of conversations
   */
  conversations: () => Channel[];

  /**
   * Current channel ID
   */
  channelId: string;

  /**
   * Open the saved notes channel
   */
  openSavedNotes: (
    navigate?: ReturnType<typeof useNavigate>
  ) => string | undefined;
}

const SidebarTitle = styled.p`
  padding-inline: ${(props) => props.theme!.gap.md};
`;

/**
 * Single conversation entry
 */
function Entry(props: { channel: Channel; active: boolean }) {
  const q = useQuantity();
  const t = useTranslation();
  const dm = props.channel.recipient;

  const status =
    dm?.status?.text ??
    (dm?.status?.presence === "Focus" ? t("app.status.focus") : undefined);

  return (
    <Link href={`/channel/${props.channel._id}`}>
      <MenuButton
        size="normal"
        alert={
          !props.active &&
          props.channel.unread &&
          (props.channel.mentions.length || true)
        }
        attention={
          props.active ? "selected" : props.channel.unread ? "active" : "normal"
        }
        icon={
          <Switch>
            <Match when={props.channel.channel_type === "Group"}>
              <Avatar
                size={32}
                fallback={props.channel.name}
                src={props.channel.generateIconURL({ max_side: 256 })}
              />
            </Match>
            <Match when={props.channel.channel_type === "DirectMessage"}>
              <Avatar
                size={32}
                src={
                  dm?.generateAvatarURL({ max_side: 256 }) ??
                  dm?.defaultAvatarURL
                }
                holepunch="bottom-right"
                overlay={
                  <UserStatusGraphic
                    status={dm?.status?.presence ?? "Invisible"}
                  />
                }
              />
            </Match>
          </Switch>
        }
      >
        <Column gap="none">
          <Switch>
            <Match when={props.channel.channel_type === "Group"}>
              <OverflowingText>
                <TextWithEmoji content={props.channel.name!} />
              </OverflowingText>
              <Typography variant="status">
                {q("members", props.channel.recipient_ids?.length || 0)}
              </Typography>
            </Match>
            <Match when={props.channel.channel_type === "DirectMessage"}>
              <OverflowingText>{dm?.username}</OverflowingText>
              <Show when={status}>
                <Tooltip content={status!} placement="top-start">
                  {(triggerProps) => (
                    <Typography {...triggerProps} variant="status">
                      <OverflowingText>
                        <TextWithEmoji content={status!} />
                      </OverflowingText>
                    </Typography>
                  )}
                </Tooltip>
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
export const HomeSidebar = (props: Props) => {
  const t = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <SidebarBase>
      <SidebarTitle>
        <Typography variant="sidebar-title">
          {t("app.main.categories.conversations")}
        </Typography>
      </SidebarTitle>
      <Link href="/">
        <MenuButton
          size="normal"
          icon={<BiSolidHome size={24} />}
          attention={location.pathname === "/" ? "active" : "normal"}
        >
          Home
        </MenuButton>
      </Link>
      <Link href="/friends">
        <MenuButton
          size="normal"
          icon={<BiSolidUserDetail size={24} />}
          attention={location.pathname === "/friends" ? "active" : "normal"}
        >
          Friends
        </MenuButton>
      </Link>
      <a
        // Use normal link by default
        href={`/channel/${props.openSavedNotes()}`}
        // Fallback to JavaScript navigation if channel doesn't exist yet
        onClick={(el) =>
          !el.currentTarget.href && props.openSavedNotes(navigate)
        }
      >
        <MenuButton
          size="normal"
          icon={<BiSolidNotepad size={24} />}
          attention={
            props.channelId && props.openSavedNotes() === props.channelId
              ? "active"
              : "normal"
          }
        >
          Saved Notes
        </MenuButton>
      </a>
      <ScrollContainer>
        <Column>
          <div />
          <For each={props.conversations()}>
            {(channel) => (
              <Entry
                channel={channel}
                active={channel._id === props.channelId}
              />
            )}
          </For>
          <div />
        </Column>
      </ScrollContainer>
    </SidebarBase>
  );
};
