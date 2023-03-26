import { BiRegularAt, BiRegularHash, BiSolidNotepad } from "solid-icons/bi";
import { Match, Switch } from "solid-js";

import { Channel } from "revolt.js";

import { useTranslation } from "@revolt/i18n";
import { TextWithEmoji } from "@revolt/markdown";
import { UserStatus } from "@revolt/ui";

import { HeaderIcon } from "../common/CommonHeader";

/**
 * Common channel header component
 */
export function ChannelHeader(props: { channel: Channel }) {
  const t = useTranslation();

  return (
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
  );
}
