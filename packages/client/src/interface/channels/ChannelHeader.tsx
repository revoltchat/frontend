import {
  BiRegularAt,
  BiRegularHash,
  BiSolidGroup,
  BiSolidMagicWand,
  BiSolidNotepad,
} from "solid-icons/bi";
import { Match, Show, Switch } from "solid-js";

import { Channel } from "revolt.js";

import { useTranslation } from "@revolt/i18n";
import { Markdown, TextWithEmoji } from "@revolt/markdown";
import { modalController } from "@revolt/modal";
import { state } from "@revolt/state";
import { LAYOUT_SECTIONS } from "@revolt/state/stores/Layout";
import {
  IconButton,
  OverflowingText,
  Spacer,
  Typography,
  UserStatus,
  styled,
} from "@revolt/ui";

import { HeaderIcon } from "../common/CommonHeader";

interface Props {
  /**
   * Channel to render header for
   */
  channel: Channel;
}

/**
 * Common channel header component
 */
export function ChannelHeader(props: Props) {
  const t = useTranslation();

  /**
   * Open channel information modal
   */
  function openChannelInfo() {
    modalController.push({
      type: "channel_info",
      channel: props.channel,
    });
  }

  return (
    <>
      <Switch>
        <Match
          when={
            props.channel.channel_type === "TextChannel" ||
            props.channel.channel_type === "VoiceChannel" ||
            props.channel.channel_type === "Group"
          }
        >
          <HeaderIcon>
            <BiRegularHash size={24} />
          </HeaderIcon>
          <TextWithEmoji content={props.channel.name!} />
          <Show when={props.channel.description}>
            <Divider />
            <a onClick={openChannelInfo}>
              <OverflowingText>
                <Typography variant="channel-topic">
                  <Markdown
                    content={props.channel.description?.split("\n").shift()}
                    disallowBigEmoji
                  />
                </Typography>
              </OverflowingText>
            </a>
          </Show>
        </Match>
        <Match when={props.channel.channel_type === "DirectMessage"}>
          <HeaderIcon>
            <BiRegularAt size={24} />
          </HeaderIcon>
          <TextWithEmoji content={props.channel.recipient?.username} />
          <UserStatus
            status={props.channel.recipient?.status?.presence ?? "Invisible"}
            size="8px"
          />
        </Match>
        <Match when={props.channel.channel_type === "SavedMessages"}>
          <HeaderIcon>
            <BiSolidNotepad size={24} />
          </HeaderIcon>
          {t("app.navigation.tabs.saved")}
        </Match>
      </Switch>

      <Spacer />

      <IconButton>
        <BiSolidMagicWand size={24} />
      </IconButton>
      <IconButton
        onClick={() =>
          state.layout.toggleSectionState(LAYOUT_SECTIONS.MEMBER_SIDEBAR, true)
        }
      >
        <BiSolidGroup size={24} />
      </IconButton>
    </>
  );
}

/**
 * Vertical divider between name and topic
 */
const Divider = styled("div", "Divider")`
  height: 20px;
  margin: 0px 5px;
  padding-left: 1px;
  background-color: ${(props) => props.theme!.colours["background-400"]};
`;
