import { BiRegularX } from "solid-icons/bi";
import { For, JSX, Show, createMemo, createSignal, onMount } from "solid-js";

import { useTranslation } from "@revolt/i18n";
import {
  Column,
  MenuButton,
  OverflowingText,
  Typography,
  invisibleScrollable,
  styled,
} from "@revolt/ui";
import { useTheme } from "@revolt/ui";

import { ClientSettingsRouting, clientSettingsList } from "./client";

invisibleScrollable;

export type SettingsList = {
  title?: JSX.Element;
  entries: SettingsEntry[];
}[];

export type SettingsEntry = {
  id?: string;
  href?: string;
  onClick?: () => void;

  hidden?: boolean;

  icon: JSX.Element;
  title: JSX.Element;
};

/**
 * HOT
 * @param props
 * @returns
 */
export function Settings(props: { onClose: () => void }) {
  const t = useTranslation();
  const theme = useTheme();

  const [page, setPage] = createSignal<undefined | string>();

  /**
   * Generate list of categories / links
   */
  const list = createMemo(() => clientSettingsList(t, theme));

  /**
   * Navigate to a certain page
   */
  function navigate(entry: SettingsEntry) {
    if (entry.onClick) {
      entry.onClick();
    } else if (entry.href) {
      window.open(entry.href, "_blank");
    } else if (entry.id) {
      setPage(entry.id);
    }
  }

  function render() {
    const id = page();
    if (!id) return null;
    const Component = ClientSettingsRouting[id];
    return Component ? <Component /> : null;
  }

  onMount(() => {
    if (!page()) {
      setPage(list()[0].entries[0].id);
    }
  });

  return (
    <>
      <Sidebar>
        <div use:invisibleScrollable>
          <SidebarContent>
            <Column gap="lg">
              <For each={list()}>
                {(category, index) => (
                  <>
                    <Show when={index()}>
                      <LineDivider />
                    </Show>
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
                              <a onClick={() => navigate(entry)}>
                                <MenuButton
                                  icon={entry.icon}
                                  attention={
                                    (
                                      entry.id
                                        ? page()?.startsWith(entry.id)
                                        : undefined
                                    )
                                      ? "selected"
                                      : "normal"
                                  }
                                >
                                  {entry.title}
                                </MenuButton>
                              </a>
                            </Show>
                          )}
                        </For>
                      </Column>
                    </Column>
                  </>
                )}
              </For>
            </Column>
          </SidebarContent>
        </div>
      </Sidebar>
      <Content>
        <InnerContent>
          <Typography variant="settings-title">{page()}</Typography>
          {render()}
        </InnerContent>
        <CloseAction>
          <CloseAnchor onClick={props.onClose}>
            <BiRegularX size={28} color="unset" />
          </CloseAnchor>
        </CloseAction>
      </Content>
    </>
  );
}

const CategoryTitle = styled(OverflowingText)`
  margin: 0 8px;
`;

const LineDivider = styled.div`
  height: 1px;
  margin: 0 8px;
  background: ${(props) => props.theme!.colours["background-300"]};
`;

const SidebarContent = styled.div`
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

const Sidebar = styled.div`
  display: flex;
  flex: 1 0 218px;
  justify-content: flex-end;
  color: ${(props) => props.theme!.colours["foreground-200"]};
  background: ${(props) => props.theme!.colours["background-100"]};
`;

const Content = styled.div`
  flex: 1 1 800px;
  flex-direction: row;

  display: flex;
  overflow-y: auto;
  background: ${(props) => props.theme!.colours["background-200"]};
`;

const InnerContent = styled.div`
  display: flex;
  gap: 13px;
  max-width: 740px;
  padding: 80px 32px;
  width: 100%;
  flex-direction: column;
`;

const CloseAnchor = styled.a`
  width: 40px;
  height: 40px;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: ${(props) => props.theme!.transitions.fast} background-color;

  border-radius: ${(props) => props.theme!.borderRadius.full};
  border: 3px solid ${(props) => props.theme!.colours["background-400"]};

  svg {
    color: ${(props) => props.theme!.colours["foreground-200"]};
  }

  &:hover {
    background: ${(props) => props.theme!.colours["background-400"]};
  }

  &:active {
    transform: translateY(2px);
  }
`;

const CloseAction = styled.div`
  flex-grow: 1;
  padding: 80px 8px;
  visibility: visible;
  position: sticky;
  top: 0;

  &:after {
    content: "ESC";
    margin-top: 4px;
    display: flex;
    justify-content: center;
    width: 40px;
    opacity: 0.5;
    font-size: 0.75rem;
  }
`;
