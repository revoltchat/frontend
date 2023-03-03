import { AdminSidebar, Column, Row, styled, Tabs } from "@revolt/ui";
import { Match, Switch } from "solid-js";

import { Home } from "./pages/Home";
import { Inspector } from "./pages/Inspector";
import { Reports } from "./pages/Reports";
import { Report } from "./pages/Report";
import { DEFAULT_TAB_OFFSET_IDX, TabState } from "@revolt/state/stores/Admin";
import { state } from "@revolt/state";

function RenderTab() {
  const idx = () => state.admin.getActiveTabIndex();
  const data = () => state.admin.getActiveTab();

  return (
    <Switch>
      <Match when={idx() === 0}>
        <Home />
      </Match>
      <Match when={idx() === 1}>
        <Reports />
      </Match>
      <Match when={data()?.type === "inspector"}>
        <Inspector />
      </Match>
      <Match when={data()?.type === "report"}>
        <Report />
      </Match>
    </Switch>
  );
}

const Base = styled(Row)`
  overflow: hidden;
`;

const ContentBase = styled(Column)`
  overflow: hidden;
`;

const Content = styled.div`
  min-height: 0;
  overflow-y: scroll;
  padding: ${(props) => props.theme!.gap.md};
`;

export default function Admin() {
  const tabs = () => {
    const tabs: Record<string, { label: string; dismissable?: boolean }> = {
      0: {
        label: "Home",
      },
      1: {
        label: "Reports",
      },
    };

    const openTabs = state.admin.getTabs();
    for (let i = 0; i < openTabs.length; i++) {
      tabs[i + DEFAULT_TAB_OFFSET_IDX] = {
        label: openTabs[i].title,
        dismissable: true,
      };
    }

    return tabs;
  };

  return (
    <Base gap="none" grow>
      <AdminSidebar
        openTab={(type, title) =>
          state.admin.addTab({ type, title } as TabState)
        }
      />
      <ContentBase grow gap="none">
        <Tabs
          tab={() => state.admin.getActiveTabIndex().toString()}
          tabs={tabs}
          onSelect={(tab) => state.admin.setActiveTabIndex(parseInt(tab))}
          onDismiss={(removedTab) => {
            const index = parseInt(removedTab);

            if (state.admin.getActiveTabIndex() === index) {
              state.admin.setActiveTabIndex(index - 1);
            }

            state.admin.removeTab(index);
          }}
        />
        <Content>
          <RenderTab />
        </Content>
      </ContentBase>
    </Base>
  );
}
