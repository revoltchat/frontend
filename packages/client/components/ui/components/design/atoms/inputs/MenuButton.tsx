import { JSX, Show, splitProps } from "solid-js";

import { cva } from "styled-system/css";
import { styled } from "styled-system/jsx";

import { Ripple } from "@revolt/ui/components/material";
import { hoverStyles } from "@revolt/ui/directives";

import { Unreads } from "../indicators";
import { typography } from "../display";

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
 * Top-level container
 */
const base = cva({
  base: {
    flexShrink: 0,

    fontWeight: 500,
    fontSize: "15px",
    userSelect: "none",

    position: "relative",
    display: "flex",
    margin: "0 var(--gap-md)",
    padding: "0 var(--gap-md)",
    borderRadius: "var(--borderRadius-xl)",

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
        color: "var(--colours-component-menubtn-default-foreground)",
        background: "var(--colours-component-menubtn-default-background)",
      },
      muted: {
        color: "var(--colours-component-menubtn-muted-foreground)",
        background: "var(--colours-component-menubtn-muted-background)",
      },
      active: {
        color: "var(--colours-component-menubtn-selected-foreground)",
        background: "var(--colours-component-menubtn-default-background)",
      },
      selected: {
        color: "var(--colours-component-menubtn-selected-foreground)",
        background: "var(--colours-component-menubtn-selected-background)",
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

/**
 * Menu button element
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
