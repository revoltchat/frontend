import type { JSXElement } from "solid-js";

import "mdui/components/segmented-button-group.js";
import "mdui/components/segmented-button.js";
import { cva } from "styled-system/css";

/**
 * @deprecated Material Expressive introduced button groups which should be used instead!
 */
export function SegmentedButton(props: {
  value: string;
  children: JSXElement;
}) {
  return (
    <mdui-segmented-button class={styles()} value={props.value}>
      {props.children}
    </mdui-segmented-button>
  );
}

/**
 * @deprecated Material Expressive introduced button groups which should be used instead!
 */
export function SingleSelectSegmentedButtonGroup(props: {
  onSelect: (e: Event & { currentTarget: HTMLInputElement }) => void;
  children: JSXElement;
  value: string;
  required?: boolean;
}) {
  return (
    <mdui-segmented-button-group
      selects="single"
      value={props.value}
      onChange={props.onSelect}
      required={props.required}
    >
      {props.children}
    </mdui-segmented-button-group>
  );
}

const styles = cva({
  base: {
    border: "1px solid var(--md-sys-color-on-surface)",

    "&:nth-child(1)": {
      borderLeft: "1px solid var(--md-sys-color-on-surface)",
    },

    "&:not(:nth-child(1))": {
      borderLeft: "none",
    },

    "&[selected]": {
      color: "rgb(var(--mdui-color-on-secondary-container))",
      background: "rgb(var(--mdui-color-secondary-container))",
    },
  },
});
