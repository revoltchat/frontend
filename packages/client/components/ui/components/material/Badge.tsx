import { JSXElement } from "solid-js";

import "mdui/components/badge.js";
import { cva } from "styled-system/css";

interface Props {
  slot: string;
  children: JSXElement;
  variant: "small" | "large";
}

export function Badge(props: Props) {
  return (
    <mdui-badge slot={props.slot ?? "badge"} class={badge()}>
      {props.children}
    </mdui-badge>
  );
}

const badge = cva({
  base: {
    padding: "var(--gap-sm)",
  },
});
