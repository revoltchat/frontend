import { Accessor, For, JSXElement, Setter, createUniqueId } from "solid-js";

import "@material/web/tabs/primary-tab.js";
import "@material/web/tabs/tabs.js";
import "mdui/components/badge.js";
import "mdui/components/tab-panel.js";
import "mdui/components/tab.js";
import "mdui/components/tabs.js";
import { styled } from "styled-system/jsx";

import { Button } from "../inputs";

type Props<K extends string> = {
  selected: Accessor<K>;
  setSelected: Setter<K>;
  tabs: {
    id: K;
    title: JSXElement;
  }[];
};

export function Tabs<K extends string>(props: Props<K>) {
  // const tabGroupId = createUniqueId();

  // return (
  //   <TabGroup>
  //     <For each={props.tabs}>
  //       {(tab, idx) => (
  //         <Button
  //           variant="plain"
  //           size="none"
  //           role="tab"
  //           aria-selected={tab.id === props.selected() ? "true" : "false"}
  //           aria-controls={`tabgroup-${tabGroupId}`}
  //           tabIndex={tab.id === props.selected() ? 0 : -1}
  //           id={`tab-${idx()}`}
  //           onPress={() => props.setSelected(tab.id as never)}
  //         >
  //           {tab.title}
  //         </Button>
  //       )}
  //     </For>
  //   </TabGroup>
  // );
  return (
    <div>
      <md-tabs>
        <md-primary-tab>Video</md-primary-tab>
        <md-primary-tab>Photos</md-primary-tab>
        <md-primary-tab>Audio</md-primary-tab>
      </md-tabs>

      <mdui-tabs value="tab-1">
        <mdui-tab value="tab-1">
          Tab 1<mdui-badge slot="badge">99+</mdui-badge>
        </mdui-tab>
        <mdui-tab value="tab-2">Tab 2</mdui-tab>
        <mdui-tab value="tab-3">Tab 3</mdui-tab>

        <mdui-tab-panel slot="panel" value="tab-1">
          Panel 1
        </mdui-tab-panel>
        <mdui-tab-panel slot="panel" value="tab-2">
          Panel 2
        </mdui-tab-panel>
        <mdui-tab-panel slot="panel" value="tab-3">
          Panel 3
        </mdui-tab-panel>
      </mdui-tabs>
    </div>
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
