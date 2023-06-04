import { BiRegularX } from "solid-icons/bi";
import {
  For,
  Show,
  createContext,
  createMemo,
  createSignal,
  onMount,
  untrack,
  useContext,
} from "solid-js";

import { Motion, Presence } from "@motionone/solid";
import { Rerun } from "@solid-primitives/keyed";

import {
  Breadcrumbs,
  Column,
  MenuButton,
  OverflowingText,
  Typography,
  invisibleScrollable,
  styled,
} from "@revolt/ui";

import { SettingsConfiguration, SettingsEntry } from ".";

invisibleScrollable;

export interface SettingsProps {
  /**
   * Close settings
   */
  onClose?: () => void;

  /**
   * Settings context
   */
  context: never;
}

/**
 * Transition animation
 */
type SettingsTransition = "normal" | "to-child" | "to-parent";

/**
 * Generic Settings component
 */
export function Settings(props: SettingsProps & SettingsConfiguration<never>) {
  const [page, setPage] = createSignal<undefined | string>();
  const [transition, setTransition] =
    createSignal<SettingsTransition>("normal");

  /**
   * Generate list of categories / links
   */
  const list = createMemo(() => props.list(props.context));

  /**
   * Navigate to a certain page
   */
  function navigate(entry: string | SettingsEntry) {
    let id;
    if (typeof entry === "object") {
      if (entry.onClick) {
        entry.onClick();
      } else if (entry.href) {
        window.open(entry.href, "_blank");
      } else if (entry.id) {
        id = entry.id;
      }
    } else {
      id = entry;
    }

    if (!id) return;

    const current = page();
    if (current?.startsWith(id)) {
      setTransition("to-parent");
    } else if (current && id.startsWith(current)) {
      setTransition("to-child");
    } else {
      setTransition("normal");
    }

    setPage(id);
  }

  /**
   * Select first page on load
   */
  onMount(() => {
    if (!page()) {
      setPage(list()[0].entries[0].id);
    }
  });

  return (
    <SettingsNavigationContext.Provider
      value={{
        navigate,
      }}
    >
      <Sidebar>
        <div use:invisibleScrollable>
          <SidebarContent>
            <Column gap="lg">
              <For each={list()}>
                {(category, index) => (
                  <Show when={!category.hidden}>
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
                  </Show>
                )}
              </For>
            </Column>
          </SidebarContent>
        </div>
      </Sidebar>
      <Content>
        <Show when={page()}>
          <InnerContent>
            <InnerColumn gap="xl">
              <Typography variant="settings-title">
                <Breadcrumbs
                  elements={page()!.split("/")}
                  renderElement={(key) => props.title(key)}
                  navigate={(keys) => navigate(keys.join("/"))}
                />
              </Typography>
              <Presence exitBeforeEnter>
                <Rerun on={page}>
                  <Motion.div
                    style={
                      untrack(transition) === "normal"
                        ? {}
                        : { visibility: "hidden" }
                    }
                    ref={(el) =>
                      untrack(transition) !== "normal" &&
                      setTimeout(() => (el.style.visibility = "visible"), 250)
                    }
                    initial={
                      transition() === "normal"
                        ? { opacity: 0, y: 100 }
                        : transition() === "to-child"
                        ? {
                            x: "100vw",
                          }
                        : { x: "-100vw" }
                    }
                    animate={{
                      opacity: 1,
                      x: 0,
                      y: 0,
                    }}
                    exit={
                      transition() === "normal"
                        ? undefined
                        : transition() === "to-child"
                        ? {
                            x: "-100vw",
                          }
                        : { x: "100vw" }
                    }
                    transition={{ duration: 0.2, easing: [0.87, 0, 0.13, 1] }}
                  >
                    {props.render({ page }, props.context)}
                  </Motion.div>
                </Rerun>
              </Presence>
              <BottomPadding />
            </InnerColumn>
          </InnerContent>
        </Show>
        <Show when={props.onClose}>
          <CloseAction>
            <CloseAnchor onClick={props.onClose}>
              <BiRegularX size={28} color="unset" />
            </CloseAnchor>
          </CloseAction>
        </Show>
      </Content>
    </SettingsNavigationContext.Provider>
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
  color: ${(props) => props.theme!.colour("onSecondaryContainer")};
  background: ${(props) => props.theme!.colour("secondary", 96)};
`;

const Content = styled.div`
  flex: 1 1 800px;
  flex-direction: row;

  display: flex;
  overflow-y: scroll;
  overflow-x: hidden;
  background: ${(props) => props.theme!.colour("secondary", 90)};
`;

const InnerContent = styled.div`
  gap: 13px;
  width: 100%;
  display: flex;
  max-width: 740px;
  padding: 80px 32px;
  justify-content: stretch;
`;

const InnerColumn = styled(Column)`
  width: 100%;
`;

const BottomPadding = styled.div`
  height: 80px;
  flex-shrink: 0;
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

const SettingsNavigationContext = createContext<{
  navigate: (path: string) => void;
}>();

/**
 * Use settings navigation context
 */
export const useSettingsNavigation = () =>
  useContext(SettingsNavigationContext)!;
