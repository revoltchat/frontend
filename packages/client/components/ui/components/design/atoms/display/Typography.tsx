import { splitProps } from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";
import { cva } from "styled-system/css";

type TypographyProps = {
  /**
   * Which variant to use
   */
  readonly variant: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} & JSX.HTMLAttributes<any>;

/**
 * Typography component for displaying text around the app
 * @param props Text rendering options
 */
export const Typography = (props: TypographyProps) => {
  return <span>Replace me! &lt;Typograhy/&gt; removed!</span>;
};

/**
 * Simple span Text wrapper to apply Typography styles
 */
export function Text(
  props: Parameters<typeof typography>[0] & { children: JSX.Element }
) {
  const [local, remote] = splitProps(props, ["children"]);
  return <span class={typography(remote)}>{local.children}</span>;
}

/**
 * Apply styles for chosen typography
 */
export const typography = cva({
  variants: {
    class: {
      display: {},
      headline: {},
      title: {},
      body: {},
      label: {},

      _messages: {
        fontWeight: 400,
        fontSize: "14px",
      },

      _status: {
        fontWeight: 400,
        fontSize: "11px",
      },
    },
    size: {
      large: {},
      medium: {},
      small: {},
    },
  },
  compoundVariants: [
    // Values derived from M3 docs:
    // https://m3.material.io/styles/typography/type-scale-tokens
    {
      class: "display",
      size: "large",
      css: {
        fontWeight: 400,
        fontSize: "57pt",
        lineHeight: "64pt",
      },
    },
    {
      class: "display",
      size: "medium",
      css: {
        fontWeight: 400,
        fontSize: "45pt",
        lineHeight: "52pt",
      },
    },
    {
      class: "display",
      size: "small",
      css: {
        fontWeight: 400,
        fontSize: "36pt",
        lineHeight: "44pt",
      },
    },
    {
      class: "headline",
      size: "large",
      css: {
        fontWeight: 400,
        fontSize: "32pt",
        lineHeight: "40pt",
      },
    },
    {
      class: "headline",
      size: "medium",
      css: {
        fontWeight: 400,
        fontSize: "28pt",
        lineHeight: "36pt",
      },
    },
    {
      class: "headline",
      size: "small",
      css: {
        fontWeight: 400,
        fontSize: "24pt",
        lineHeight: "32pt",
      },
    },
    {
      class: "title",
      size: "large",
      css: {
        fontWeight: 500,
        fontSize: "22pt",
        lineHeight: "28pt",
      },
    },
    {
      class: "title",
      size: "medium",
      css: {
        fontWeight: 500,
        fontSize: "16pt",
        lineHeight: "24pt",
      },
    },
    {
      class: "title",
      size: "small",
      css: {
        fontWeight: 500,
        fontSize: "14pt",
        lineHeight: "20pt",
      },
    },
    {
      class: "body",
      size: "large",
      css: {
        fontWeight: 400,
        fontSize: "16pt",
        lineHeight: "24pt",
      },
    },
    {
      class: "body",
      size: "medium",
      css: {
        fontWeight: 400,
        fontSize: "14pt",
        lineHeight: "20pt",
      },
    },
    {
      class: "body",
      size: "small",
      css: {
        fontWeight: 400,
        fontSize: "12pt",
        lineHeight: "16pt",
      },
    },
    {
      class: "label",
      size: "large",
      css: {
        fontWeight: 500,
        fontSize: "14pt",
        lineHeight: "20pt",
      },
    },
    {
      class: "label",
      size: "medium",
      css: {
        fontWeight: 500,
        fontSize: "12pt",
        lineHeight: "16pt",
      },
    },
    {
      class: "label",
      size: "small",
      css: {
        fontWeight: 500,
        fontSize: "11pt",
        lineHeight: "16pt",
      },
    },
  ],
  defaultVariants: {
    class: "body",
    size: "medium",
  },
});
