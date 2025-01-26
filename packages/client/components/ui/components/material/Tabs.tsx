import { For, JSXElement } from "solid-js";

import "mdui/components/tab-panel.js";
import "mdui/components/tab.js";
import "mdui/components/tabs.js";

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
