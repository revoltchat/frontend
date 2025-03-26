import { styled } from "styled-system/jsx";

import { hoverStyles } from "@revolt/ui/directives";

import MdClose from "@material-design-icons/svg/filled/close.svg?component-solid";

import { iconSize } from "../../../..";
import { Plural, Trans, useLingui } from "@lingui-solid/solid/macro";

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
  const { t } = useLingui();

  return (
    <Base class={hoverStyles()}>
      <MdClose {...iconSize(16)} />{" "}
      <Plural
        value={props.count}
        one="1 blocked message"
        other={`${props.count} blocked messages`}
      />
    </Base>
  );
}
