import {
  BiRegularAt,
  BiRegularGroup,
  BiRegularHash,
  BiSolidGroup,
  BiSolidMagicWand,
  BiSolidNotepad,
} from "solid-icons/bi";
import { Match, Show, Switch } from "solid-js";

import { Channel } from "revolt.js";

import { useTranslation } from "@revolt/i18n";
import { Markdown, TextWithEmoji } from "@revolt/markdown";
import { state } from "@revolt/state";
import { LAYOUT_SECTIONS } from "@revolt/state/stores/Layout";
import {
  IconButton,
  InlineIcon,
  OverflowingText,
  Spacer,
  Typography,
  UserStatus,
  styled,
} from "@revolt/ui";

import { HeaderIcon } from "../common/CommonHeader";

/**
 * Vertical divider between name and topic
 */
const Divider = styled("div", "Divider")`
  height: 20px;
  margin: 0px 5px;
  padding-left: 1px;
  background-color: ${(props) => props.theme!.colours["background-400"]};
`;

/**
 * Common channel header component
 */
export function ChannelHeader(props: { channel: Channel }) {
  const t = useTranslation();

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
            <OverflowingText>
              <Typography variant="channel-topic">
                <Markdown
                  content={props.channel.description!}
                  disallowBigEmoji
                />
              </Typography>
            </OverflowingText>
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
