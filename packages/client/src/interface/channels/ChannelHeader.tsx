import { useTranslation } from "@revolt/i18n";
import { TextWithEmoji } from "@revolt/markdown";
import { Channel } from "revolt.js";
import { BiRegularAt } from "solid-icons/bi";
import { Match, Switch } from "solid-js";

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
        <TextWithEmoji content={props.channel.name!} />
      </Match>
      <Match when={props.channel.channel_type === "DirectMessage"}>
        <BiRegularAt size={24} />{" "}
        <TextWithEmoji content={props.channel.recipient?.username} />
      </Match>
      <Match when={props.channel.channel_type === "SavedMessages"}>
        {t("app.navigation.tabs.saved")}
      </Match>
    </Switch>
  );
}
