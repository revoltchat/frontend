import { JSX, Show, splitProps } from "solid-js";

import { cva } from "styled-system/css";
import { styled } from "styled-system/jsx";

import { Ripple } from "./Ripple";
import { Unreads } from "./Unreads";

export type Props = {
  /**
   * Button size
   * @default thin
   */
  readonly size?: "thin" | "normal";

  /**
   * Button attention
   * @default normal
   */
  readonly attention?: "muted" | "normal" | "active" | "selected";

  /**
   * Button icon
   */
  readonly icon?: JSX.Element;

  /**
   * Button content
   */
  readonly children?: JSX.Element;

  /**
   * Alert indicator
   */
  readonly alert?: number | boolean;

  /**
   * Hover actions
   */
  readonly actions?: JSX.Element;
};

/**
 * Button intended for sidebar contexts
 */
export function MenuButton(props: Props & JSX.HTMLAttributes<HTMLDivElement>) {
  const [local, other] = splitProps(props, [
    "attention",
    "size",
    "icon",
    "children",
    "alert",
    "actions",
  ]);

  return (
    // TODO: port to panda-css to merge down components
    <div
      {...other}
      classList={{
        [base({
          attention: local.attention,
          size: local.size,
          hasActions: local.actions ? "yes" : "no",
        })]: true,
      }}
      // @codegen directives props=other include=floating
    >
      <Ripple />
      {/* <Base {...other} align> */}
      {local.icon}
      <Content>{local.children}</Content>
      <Show when={local.alert}>
        <Unreads
          count={typeof local.alert === "number" ? local.alert : 0}
          size={typeof local.alert === "number" ? "0.85rem" : "0.4rem"}
          unread
        />
      </Show>
      {local.actions && (
        <Actions onClick={(e) => e.stopPropagation()}>{local.actions}</Actions>
      )}
      {/* </Base> */}
    </div>
  );
}

/**
 * Top-level container
 */
const base = cva({
  base: {
    flexShrink: 0,

    fontWeight: 500,
    fontSize: "15px",
    userSelect: "none",

    // for <Ripple />:
    position: "relative",

    display: "flex",
    margin: "0 var(--gap-md)",
    padding: "0 var(--gap-md)",
    borderRadius: "var(--borderRadius-xl)",

    color: "var(--color)",
    fill: "var(--color)",

    "& > svg": {
      alignSelf: "center",
    },
  },
  variants: {
    size: {
      normal: {
        height: "42px",
        gap: "var(--gap-md)",
      },
      thin: {
        height: "32px",
        gap: "var(--gap-sm)",

        // implicitly align center since we won't stack anything
        alignItems: "center",
      },
    },
    attention: {
      normal: {
        "--color": "var(--md-sys-color-outline)",
        background: "transparent",
      },
      muted: {
        "--color": "var(--md-sys-color-outline-variant)",
        background: "transparent",
      },
      active: {
        "--color": "var(--md-sys-color-on-surface)",
        background: "transparent",
      },
      selected: {
        "--color": "var(--md-sys-color-on-primary-container)",
        background: "var(--md-sys-color-primary-container)",
      },
    },
    hasActions: {
      no: {},
      yes: {
        "&:hover :last-child": {
          display: "flex",
        },
      },
    },
  },
  defaultVariants: {
    size: "normal",
    attention: "normal",
    hasActions: "no",
  },
});

/**
 * Textual content
 */
const Content = styled("div", {
  base: {
    flexGrow: 1,
    minWidth: 0,
  },
});

/**
 * Right-side actions
 */
const Actions = styled("div", {
  base: {
    alignSelf: "center",

    display: "none",
    alignItems: "center",
    flexDirection: "row",
    gap: "var(--gap-sm)",
  },
});
