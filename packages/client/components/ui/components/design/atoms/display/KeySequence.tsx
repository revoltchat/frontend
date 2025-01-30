import { Component, For, createMemo } from "solid-js";
import { styled } from "styled-system/jsx";

import {
  KeybindSequence,
  type KeyComboSequence as TKeySequence,
} from "@revolt/keybinds";

import { Key } from "./Key";

export interface Props {
  sequence: string | TKeySequence;
  short?: boolean;
}

// UNCHECKED STYLES (check commit 2025-01-15)
const Base = styled("kbd", {
  base: {
    display: "inline-flex",
    placeItems: "center",
    flexWrap: "wrap",
    gap: "1ch",
    lineHeight: 1,
    fontSize: "0.85em",
    fontFamily: "var(--fonts-monospace)",

    "& > kbd": {
      display: "inline-flex",
      alignItems: "center",
      gap: "0.5ch",
    },
  },
});

export const KeySequence: Component<Props> = (props) => {
  // accepting strings and parsing them isn't really needed other than a nice api?
  const sequence = createMemo(() =>
    typeof props.sequence === "string"
      ? KeybindSequence.parse(props.sequence)
      : props.sequence
  );

  return (
    <Base {...props}>
      <For each={sequence()}>
        {(combo) => (
          <For each={combo}>
            {(key, index) => (
              <>
                {index() !== 0 && "+"}
                <Key {...props}>{key}</Key>
              </>
            )}
          </For>
        )}
      </For>
    </Base>
  );
};
