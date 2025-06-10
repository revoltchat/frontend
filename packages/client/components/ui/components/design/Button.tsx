import { Show, splitProps } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";

import { AriaButtonProps, createButton } from "@solid-aria/button";
import { cva } from "styled-system/css/cva";

import { Ripple } from "./Ripple";
import { typography } from "./Text";

type Props = Omit<
  Parameters<typeof button>[0] &
    AriaButtonProps &
    JSX.DirectiveAttributes &
    Pick<
      JSX.ButtonHTMLAttributes<HTMLButtonElement>,
      "role" | "tabIndex" | "aria-selected"
    >,
  "onClick"
>;

/**
 * Buttons prompt most actions in a UI
 *
 * @specification https://m3.material.io/components/buttons
 */
export function Button(props: Props) {
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

const button = cva({
  base: {
    ...typography.raw(),

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
    transition: "var(--transitions-fast) all",
  },
  variants: {
    /**
     * Variant is equivalent to 'color' in Material spec
     */
    variant: {
      elevated: {
        boxShadow: "0 0.5px 1.5px #0004",
        background: "var(--md-sys-color-surface-container-low)",
        color: "var(--md-sys-color-primary)",
      },
      filled: {
        background: "var(--md-sys-color-primary)",
        color: "var(--md-sys-color-on-primary)",
      },
      tonal: {
        background: "var(--md-sys-color-secondary-container)",
        color: "var(--md-sys-color-on-secondary-container)",
      },
      outlined: {
        border: "1px solid var(--md-sys-color-outline-variant)",
        color: "var(--md-sys-color-on-surface-variant)",
      },
      text: {
        color: "var(--md-sys-color-primary)",
      },

      // Old entries:

      /**
       * @deprecated
       */
      success: {
        fill: "var(--customColours-success-onColor)",
        color: "var(--customColours-success-onColor)",
        background: "var(--customColours-success-color)",
      },
      /**
       * @deprecated
       */
      warning: {
        fill: "var(--customColours-warning-onColor)",
        color: "var(--customColours-warning-onColor)",
        background: "var(--customColours-warning-color)",
      },
      /**
       * @deprecated
       */
      error: {
        fill: "var(--customColours-error-onColor)",
        color: "var(--customColours-error-onColor)",
        background: "var(--customColours-error-color)",
      },
      /**
       * @deprecated use filled
       */
      primary: {
        fill: "var(--colours-component-btn-foreground-primary)",
        color: "var(--colours-component-btn-foreground-primary)",
        background: "var(--colours-component-btn-background-primary)",
      },
      /**
       * @deprecated use tonal
       */
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
    },
    /**
     * Expressive shapes
     */
    shape: {
      round: {
        borderRadius: "var(--borderRadius-full)",
      },
      square: {},
    },
    /**
     * Expressive sizes
     */
    size: {
      xs: {
        height: "32px",
        paddingInline: "12px",
      },
      sm: {
        height: "40px",
        paddingInline: "16px",
      },
      md: {
        height: "56px",
        paddingInline: "24px",
      },
      lg: {
        height: "96px",
        paddingInline: "48px",
      },
      xl: {
        height: "136px",
        paddingInline: "64px",
      },

      // Old code:
      icon: {
        width: "36px",
        height: "36px",
      },
      /**
       * @deprecated
       */
      small: {
        height: "40px",
        paddingInline: "16px",
        borderRadius: "12px",

        ...typography.raw(),
      },
      /**
       * @deprecated
       */
      normal: {
        height: "38px",
        minWidth: "96px",
        padding: "2px 16px",
        fontSize: "0.8125rem",
      },
      /**
       * @deprecated
       */
      fab: {
        width: "42px",
        height: "42px",
        borderRadius: "var(--borderRadius-lg)",
      },
      /**
       * @deprecated
       */
      fluid: {
        borderRadius: "var(--borderRadius-md)",
      },
      /**
       * @deprecated
       */
      inline: {
        padding: "var(--gap-xs) var(--gap-md)",
        fontSize: "0.8125rem",
        borderRadius: "var(--borderRadius-md)",
      },
      /**
       * @deprecated
       */
      none: {
        borderRadius: "0",
      },
    },
  },
  defaultVariants: {
    size: "sm",
    shape: "round",
    variant: "filled",
  },
  compoundVariants: [
    {
      shape: "square",
      size: ["sm", "xs"],
      css: {
        borderRadius: "var(--borderRadius-md)",
      },
    },
    {
      shape: "square",
      size: "md",
      css: {
        borderRadius: "var(--borderRadius-lg)",
      },
    },
    {
      shape: "square",
      size: ["xl", "lg"],
      css: {
        borderRadius: "var(--borderRadius-xl)",
      },
    },
  ],
});
