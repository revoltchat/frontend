import { styled } from "styled-system/jsx";

import { useTranslation } from "@revolt/i18n";
import { hoverStyles } from "@revolt/ui/directives";

import MdClose from "@material-design-icons/svg/filled/close.svg?component-solid";

import { iconSize } from "../../../..";

/**
 * Base styles
 */
const Base = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",

    gap: "var(--gap-s)",
    marginTop: "var(--gap-md)",
    borderRadius: "var(--borderRadius-md)",
    padding: "var(--gap-sm) var(--gap-xxl)",

    fontSize: "0.8em" /* TODO should be in typography */,
    color: "var(--colours-messaging-component-blocked-message-foreground)",
    fill: "var(--colours-messaging-component-blocked-message-foreground)",
    background: "var(--colours-messaging-component-blocked-message-background)",
  },
});

interface Props {
  /**
   * Number of blocked messages
   */
  count: number;
}

/**
 * Generic message divider
 */
export function BlockedMessage(props: Props) {
  const t = useTranslation();

  return (
    <Base class={hoverStyles()}>
      <MdClose {...iconSize(16)} />{" "}
      {t("app.main.channel.misc.blocked_messages", {
        count: props.count.toString(),
      })}
    </Base>
  );
}
