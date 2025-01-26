import {
  FaSolidArrowDown,
  FaSolidArrowLeft,
  FaSolidArrowRight,
  FaSolidArrowUp,
} from "solid-icons/fa";
import { Component, JSXElement, createMemo } from "solid-js";
import { styled } from "styled-system/jsx";

import { useTranslation } from "@revolt/i18n";

export interface Props {
  children: string;
  short?: boolean;
  /** if the key should be styled in a more simple way */
  simple?: boolean;
}

// UNCHECKED STYLES (check commit 2025-01-15)
const Base = styled("div", {
  base: {
    display: "inline-flex",
    color: "var(--colours-component-key-foreground)",
    background: "var(--colours-component-key-background)",
    padding: "0.5ch 1ch 0.35ch",
    borderRadius: "3px",
    fontWeight: 700,
    fontFamily: "var(--fonts-monospace)",
    textTransform: "uppercase",
  },
  variants: {
    simple: {
      true: {},
      false: {
        boxShadow:
          "0 1px 1px rgba(133, 133, 133, 0.2), 0 2.5px 0 0 rgba(0, 0, 0, 0.5)",
        "&:active": {
          outline: "1px solid rgb(0 0 0 / 0.3)",
          transform: "translateY(2px)",
          boxShadow: "0 1px 1px rgba(0, 0, 0, 0.2)",
        },
      },
    },
  },
  defaultVariants: {
    simple: false,
  },
});

const REPLACEMENTS: Record<string, () => JSXElement> = {
  ArrowUp: () => <FaSolidArrowUp size="1em" />,
  ArrowDown: () => <FaSolidArrowDown size="1em" />,
  ArrowLeft: () => <FaSolidArrowLeft size="1em" />,
  ArrowRight: () => <FaSolidArrowRight size="1em" />,
};

export const Key: Component<Props> = (props) => {
  const t = useTranslation();

  const keyName = createMemo(() => {
    const key = props.children;

    return (
      REPLACEMENTS[key]?.() ??
      (props.short
        ? t(
            `keys.${key}.short` as any,
            {},
            t(`keys.${key}.full` as any, {}, key)
          )
        : t(`keys.${key}.full` as any, {}, key))
    );
  });

  return <Base simple={props.simple}>{keyName()}</Base>;
};
