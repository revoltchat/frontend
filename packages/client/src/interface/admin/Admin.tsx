import { AdminSidebar, Column, Row, styled, Tabs } from "@revolt/ui";
import { createSignal, Match, Switch } from "solid-js";
import {
  adminStore,
  NarrowedSetter,
  NarrowedState,
  setAdminStore,
  TabState,
} from "./state";

import { Home } from "./pages/Home";
import { Inspector } from "./pages/Inspector";
import { Reports } from "./pages/Reports";
import { Report } from "./pages/Report";

export type TabProps<T extends TabState["type"]> = {
  state: () => NarrowedState<T>;
  setState: NarrowedSetter<T>;
};

function RenderTab(props: { idx: number }) {
  const data = () => adminStore.tabs[props.idx - 2];
  const setter = (data: TabState) => setAdminStore("tabs", props.idx - 2, data);

  return (
    <Switch>
      <Match when={props.idx === 0}>
        <Home />
      </Match>
      <Match when={props.idx === 1}>
        <Reports />
      </Match>
      <Match when={data().type === "inspector"}>
        <Inspector
          state={data as () => NarrowedState<"inspector">}
          setState={setter as NarrowedSetter<"inspector">}
        />
      </Match>
      <Match when={data().type === "reports"}>
        <Report
          state={data as () => NarrowedState<"reports">}
          setState={setter as NarrowedSetter<"reports">}
        />
      </Match>
    </Switch>
  );
}

const Content = styled.div`
  padding: ${(props) => props.theme!.gap.md};
`;

export default function Admin() {
  const [tab, setTab] = createSignal("0");

  const tabs = () => {
    const tabs: Record<string, { label: string; dismissable?: boolean }> = {
      0: {
        label: "Home",
      },
      1: {
        label: "Reports",
      },
    };

    for (let i = 0; i < adminStore.tabs.length; i++) {
      tabs[i + 2] = {
        label: adminStore.tabs[i].title,
        dismissable: true,
      };
    }

    return tabs;
  };

  return (
    <Row gap="none" grow>
      <AdminSidebar
        openTab={(type, title) =>
          setAdminStore("tabs", (tabs) => [
            ...tabs,
            { type, title } as TabState,
          ])
        }
      />
      <Column grow gap="none">
        <Tabs
          tab={tab}
          tabs={tabs}
          onSelect={setTab}
          onDismiss={(removedTab) => {
            const index = parseInt(removedTab) - 2;

            if (tab() === removedTab) {
              setTab((parseInt(removedTab) - 1).toString());
            }

            setAdminStore("tabs", (tabs) =>
              tabs.filter((_, idx) => index !== idx)
            );
          }}
        />
        <Content>
          <RenderTab idx={parseInt(tab())} />
        </Content>
      </Column>
    </Row>
  );
}
