import { Accessor, For, Show } from "solid-js";

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
  list: Accessor<SettingsList>;
  page: Accessor<string | undefined>;
}) {
  const { navigate } = useSettingsNavigation();

  return (
    <Base>
      <div use:invisibleScrollable>
        <Content>
          <Column gap="lg">
            {props.list().prepend}
            <For each={props.list().entries}>
              {(category) => (
                <Show when={!category.hidden}>
                  <Column>
                    <Show when={category.title}>
                      <CategoryTitle>
                        <Typography variant="label">
                          {category.title}
                        </Typography>
                      </CategoryTitle>
                    </Show>
                    <Column gap="sm">
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
            {props.list().append}
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
  min-width: 218px;
  max-width: 260px;
  padding: 80px 8px;
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
  margin: 0 8px;
  color: ${(props) => props.theme!.colour("primary")};
`;
