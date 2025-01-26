import { Accessor, For, JSXElement, Setter, createUniqueId } from "solid-js";

import "mdui/components/tab-panel.js";
import "mdui/components/tab.js";
import "mdui/components/tabs.js";
import { styled } from "styled-system/jsx";

import { Button } from "../design/atoms/inputs";

type Props = {
  defaultTab?: number;
  tabs: {
    title: JSXElement;
    content: JSXElement;
  }[];
};

export function Tabs(props: Props) {
  return (
    <mdui-tabs value={`tab-${props.defaultTab ?? 0}`} full-width>
      <For each={props.tabs}>
        {(tab, idx) => (
          <>
            <mdui-tab value={`tab-${idx()}`}>{tab.title}</mdui-tab>
            <mdui-tab-panel slot="panel" value={`tab-${idx()}`}>
              {tab.content}
            </mdui-tab-panel>
          </>
        )}
      </For>
    </mdui-tabs>
  );
}

const TabGroup = styled("div", {
  base: {
    display: "flex",
    flexDirection: "row",

    justifyContent: "center",

    borderBottom: "2px solid black",

    "& button": {
      width: "120px",
      padding: "var(--gap-md) var(--gap-lg)",
      borderY: "var(--gap-sm) solid transparent",
    },

    "& button[aria-selected=true]": {
      borderBottom: "var(--gap-xs) solid black",
    },
  },
});
