import { Show } from "solid-js";
import { styled } from "styled-system/jsx";

import { Channel } from "revolt.js";

import { useTranslation } from "@revolt/i18n";

import { Text } from "../display";

interface Props {
  /**
   * Channel information
   */
  channel: Channel;
}

/**
 * Mark the beginning of a conversation
 */
export function ConversationStart(props: Props) {
  const t = useTranslation();

  return (
    <Base>
      <Show when={props.channel.type !== "SavedMessages"}>
        <Text class="headline" size="large">
          {props.channel.name ?? props.channel.recipient?.username}
        </Text>
      </Show>
      <Text class="title">
        {t(
          `app.main.channel.start.${
            props.channel.type === "SavedMessages" ? "saved" : "group"
          }`
        )}
      </Text>
    </Base>
  );
}

/**
 * Base styles
 */
const Base = styled("div", {
  base: {
    display: "flex",
    userSelect: "none",
    flexDirection: "column",
    margin: "18px 16px 10px 16px",
  },
});
