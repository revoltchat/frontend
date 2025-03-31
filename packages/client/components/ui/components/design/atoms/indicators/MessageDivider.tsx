import { Show } from "solid-js";

import { styled } from "styled-system/jsx";

/**
 * Divider line
 */
const Base = styled("div", {
  base: {
    height: 0,
    display: "flex",
    userSelect: "none",
    alignItems: "center",
    margin: "17px 12px 5px",

    "& time": {
      marginTop: "-2px",
      fontSize: "0.6875rem",
      lineHeight: "0.6875rem",
      fontWeight: 600,
      paddingInline: "5px 5px",

      borderRadius: "var(--borderRadius-md)",

      color: "var(--colours-messaging-component-message-divider-foreground)",
      background: "var(--colours-background)",
    },

    borderTop:
      "thin solid var(--colours-messaging-component-message-divider-background)",
  },
  variants: {
    unread: {
      true: {
        borderTop:
          "thin solid var(--colours-messaging-component-message-divider-unread-background)",
      },
    },
  },
});

/**
 * Unread indicator
 */
const Unread = styled("div", {
  base: {
    fontSize: "0.625rem",
    fontWeight: 600,
    color:
      "var(--colours-messaging-component-message-divider-unread-foreground)",
    background:
      "var(--colours-messaging-component-message-divider-unread-background)",

    padding: "2px 6px",
    marginTop: "-1px",
    borderRadius: "60px",
  },
});

interface Props {
  /**
   * Display the date
   */
  date?: string;

  /**
   * Show unread indicator
   */
  unread?: boolean;
}

/**
 * Generic message divider
 */
export function MessageDivider(props: Props) {
  return (
    <Base unread={props.unread}>
      <Show when={props.unread}>
        <Unread>NEW</Unread>
      </Show>
      <Show when={props.date}>
        <time>{props.date}</time>
      </Show>
    </Base>
  );
}
