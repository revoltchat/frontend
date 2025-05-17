import { Show, splitProps } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";

import { AriaButtonProps, createButton } from "@solid-aria/button";
import { cva } from "styled-system/css/cva";

import { Ripple } from "@revolt/ui/components/material";

import { typography } from "../display";

const button = cva({
  base: {
    // for <Ripple />:
    position: "relative",

    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    fontWeight: 500,
    fontFamily: "inherit",

    cursor: "pointer",
    border: "none",
    borderRadius: "var(--borderRadius-full)",
    transition: "var(--transitions-fast) all",

    // "&:hover": {
    //   filter: "brightness(1.2)",
    // },

    "&:disabled": {
      filter: "saturate(0)",
      cursor: "not-allowed",
    },
  },
  variants: {
    /**
     * Variant is equivalent to 'color' in Material spec
     */
    variant: {
      // todo: implement material colour types
      // https://m3.material.io/components/buttons/specs

      success: {
        fill: "var(--customColours-success-onColor)",
        color: "var(--customColours-success-onColor)",
        background: "var(--customColours-success-color)",
      },
      warning: {
        fill: "var(--customColours-warning-onColor)",
        color: "var(--customColours-warning-onColor)",
        background: "var(--customColours-warning-color)",
      },
      error: {
        fill: "var(--customColours-error-onColor)",
        color: "var(--customColours-error-onColor)",
        background: "var(--customColours-error-color)",
      },
      primary: {
        fill: "var(--colours-component-btn-foreground-primary)",
        color: "var(--colours-component-btn-foreground-primary)",
        background: "var(--colours-component-btn-background-primary)",
      },
      secondary: {
        fill: "var(--colours-component-btn-foreground-secondary)",
        color: "var(--colours-component-btn-foreground-secondary)",
        background: "var(--colours-component-btn-background-secondary)",
      },
      /**
       * @deprecated use text instead
       */
      plain: {
        fill: "var(--colours-component-btn-foreground-plain)",
        color: "var(--colours-component-btn-foreground-plain)",

        "&:hover": {
          textDecoration: "underline",
        },

        "&:disabled": {
          textDecoration: "none",
        },
      },

      // Material definitions

      text: {
        color: "var(--md-sys-color-primary)",
      },
    },
    size: {
      // todo: implement expressive button sizes
      small: {
        height: "40px",
        paddingInline: "16px",
        borderRadius: "12px",

        ...typography.raw(),
      },
      // https://m3.material.io/components/buttons/specs

      normal: {
        height: "38px",
        minWidth: "96px",
        padding: "2px 16px",
        fontSize: "0.8125rem",
      },
      // compact: {
      //   minWidth: "96px",
      //   fontSize: "0.8125rem",
      //   height: "32px",
      //   padding: "2px 12px",
      // },
      icon: {
        width: "36px",
        height: "36px",
      },
      fab: {
        width: "42px",
        height: "42px",
        borderRadius: "var(--borderRadius-lg)",
      },
      fluid: {
        borderRadius: "var(--borderRadius-md)",
      },
      inline: {
        padding: "var(--gap-xs) var(--gap-md)",
        fontSize: "0.8125rem",
        borderRadius: "var(--borderRadius-md)",
      },
      none: {
        borderRadius: "0",
      },
    },
  },
  defaultVariants: {
    size: "normal",
    variant: "primary",
  },
});

export function Button(
  props: Omit<
    Parameters<typeof button>[0] &
      AriaButtonProps &
      JSX.DirectiveAttributes &
      Pick<
        JSX.ButtonHTMLAttributes<HTMLButtonElement>,
        "role" | "tabIndex" | "aria-selected"
      >,
    "onClick"
  >,
) {
  const [passthrough, propsRest] = splitProps(props, [
    "aria-selected",
    "tabIndex",
    "role",
  ]);

  const [style, rest] = splitProps(propsRest, ["size", "variant"]);
  let ref: HTMLButtonElement | undefined;

  const { buttonProps } = createButton(rest, () => ref);
  return (
    <button
      {...passthrough}
      {...buttonProps}
      ref={ref}
      class={button(style)}
      // @codegen directives props=rest include=floating
    >
      <Show when={!buttonProps.disabled}>
        <Ripple />
      </Show>
      {rest.children}
    </button>
  );
}
