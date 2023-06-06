import { Accessor, For, Setter, Show, createMemo, onMount } from "solid-js";

import {
  Column,
  OverflowingText,
  Typography,
  invisibleScrollable,
  styled,
} from "@revolt/ui";

import { SettingsList } from "..";
import { useSettingsNavigation } from "../Settings";

import { SidebarButton } from "./SidebarButton";

invisibleScrollable;

/**
 * Settings Sidebar Layout
 */
export function SettingsSidebar(props: {
  context: never;
  list: (context: never) => SettingsList;

  setPage: Setter<string | undefined>;
  page: Accessor<string | undefined>;
}) {
  const { navigate } = useSettingsNavigation();

  /**
   * Generate list of categories / links
   */
  const list = createMemo(() => props.list(props.context));

  /**
   * Select first page on load
   */
  onMount(() => {
    if (!props.page()) {
      props.setPage(list().entries[0].entries[0].id);
    }
  });

  return (
    <Base>
      <div use:invisibleScrollable>
        <Content>
          <Column gap="lg">
            {list().prepend}
            <For each={list().entries}>
              {(category) => (
                <Show when={!category.hidden}>
                  <Column>
                    <Show when={category.title}>
                      <CategoryTitle>
                        {category.title}
                      </CategoryTitle>
                    </Show>
                    <Column gap="s">
                      <For each={category.entries}>
                        {(entry) => (
                          <Show when={!entry.hidden}>
                            <SidebarButton onClick={() => navigate(entry)}>
                              {entry.icon} {entry.title}
                            </SidebarButton>
                          </Show>
                        )}
                      </For>
                    </Column>
                  </Column>
                </Show>
              )}
            </For>
            {list().append}
          </Column>
        </Content>
      </div>
    </Base>
  );
}

/**
 * Base layout of the sidebar
 */
const Base = styled("div", "Sidebar")`
  display: flex;
  flex: 1 0 218px;
  justify-content: flex-end;

  color: ${(props) => props.theme!.colour("onSecondaryContainer")};
  background: ${(props) => props.theme!.colour("secondary", 96)};
`;

/**
 * Aligned content within the sidebar
 */
const Content = styled("div", "Content")`
  min-width: 230px;
  max-width: 300px;
  padding: 74px 0 8px;
  display: flex;
  gap: 2px;

  flex-direction: column;

  a > div {
    margin: 0;
  }
`;

/**
 * Titles for each category
 */
const CategoryTitle = styled(OverflowingText)`
  text-transform: uppercase;
  font-size: 0.75rem;
  font-weight: 700;
  margin: 0 8px;
  color: ${(props) => props.theme!.colour("primary")};
`;
