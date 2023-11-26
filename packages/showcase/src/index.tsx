/* eslint-disable solid/reactivity */

/* @refresh reload */
import { Accessor, For, Match, Show, Switch, createSignal } from "solid-js";

/**
 * Configure contexts and render App
 */
import { render } from "solid-js/web";

import i18n, { I18nContext } from "@revolt/i18n";
import {
  ApplyGlobalStyles,
  Checkbox,
  Column,
  ComboBox,
  Input,
  Masks,
  MenuButton,
  Row,
  Tabs,
  ThemeProvider,
  Typography,
  darkTheme,
  styled,
} from "@revolt/ui";
import { SidebarBase } from "@revolt/ui/components/navigation/channels/common";
import "@revolt/ui/styles";

import components from "./stories";

const Container = styled(Column)`
  height: 100%;
`;

const Link = styled.a`
  cursor: pointer;
`;

const Sidebar = styled(SidebarBase)`
  padding: 1em;
`;

const Content = styled.div`
  flex-grow: 1;
  padding: 1rem;
`;

const PropTypesEditor = styled.div`
  flex-grow: 0;
  padding: 1rem;
  max-height: 360px;
  background: ${(props) => props.theme!.colours["background-200"]};
`;

render(() => {
  const [component, select] = createSignal<
    keyof typeof components | undefined
  >();
  const [tab, selectTab] = createSignal("");
  const [props, setProps] = createSignal<object>({});

  /**
   * Signal prop types
   */
  const propTypes = () => components[component()!]?.propTypes ?? {};

  /**
   * Signal tabs
   */
  const tabs = () => {
    const obj: Record<string, { label: string }> = {};
    const key = component();

    if (key) {
      const component = components[key];
      if (component.stories) {
        for (const story of component.stories) {
          obj[story.title] = {
            label: story.title,
          };
        }
      }
    }

    return obj;
  };

  /**
   * Signal current props
   */
  const currentProps = () => {
    const entry = components[component()!];
    if (entry) {
      const { props: componentProps, stories } = entry;
      const story = stories.find((story) => story.title === tab());

      if (story) {
        return {
          ...componentProps,
          ...story.props,
          ...props(),
        };
      } else {
        return {};
      }
    } else {
      return {};
    }
  };

  /**
   * Render a given component
   * @param component Component
   * @param tab Tab
   * @param overwrittenProps Overwritten props
   * @returns Component
   */
  function render(
    component: string | undefined,
    tab: string,
    overwrittenProps: Accessor<object>
  ) {
    const entry = components[component!];
    if (entry) {
      let { component: Component } = entry;
      const { stories, effects, decorators } = entry;

      const story = stories.find((story) => story.title === tab);
      if (story) {
        if (story.component) {
          Component = story.component;
        }

        const effectProps: Record<string, (...args: object[]) => object> = {};
        if (effects) {
          for (const effect of Object.keys(effects)) {
            effectProps[effect] = (...args) =>
              setProps({
                ...overwrittenProps(),
                ...(effects as Record<string, (...args: unknown[]) => object>)[
                  effect
                ](currentProps(), ...args),
              });
          }
        }

        if (!Component) {
          return <h1>Component is null!</h1>;
        }

        let el = <Component {...currentProps()} {...effectProps} />;

        if (story.decorators) {
          for (const Decorator of story.decorators) {
            el = (
              <Decorator childProps={{ ...currentProps(), ...effectProps }}>
                {el}
              </Decorator>
            );
          }
        }

        if (decorators) {
          for (const Decorator of decorators) {
            el = (
              <Decorator childProps={{ ...currentProps(), ...effectProps }}>
                {el}
              </Decorator>
            );
          }
        }

        return el;
      }
    }

    return null;
  }

  return (
    <div style={{ background: "#111", height: "100%" }}>
      <Masks />
      <I18nContext.Provider value={i18n}>
        <ThemeProvider theme={darkTheme()}>
          <ApplyGlobalStyles />
          <Container>
            <Row gap="none" justify="stretch" grow>
              <Sidebar>
                <Column>
                  <Typography variant="legacy-settings-section-title">
                    COMPONENTS
                  </Typography>
                  <For each={Object.keys(components)}>
                    {(entry) => (
                      <Link
                        onClick={() => {
                          setProps({});
                          select(entry);
                          selectTab(components[entry].stories[0]?.title);
                        }}
                      >
                        <MenuButton
                          attention={
                            component() === entry ? "selected" : "normal"
                          }
                        >
                          {entry}
                        </MenuButton>
                      </Link>
                    )}
                  </For>
                </Column>
              </Sidebar>
              <Column gap="none" grow>
                <Show when={() => component()! in components}>
                  <Tabs
                    tabs={tabs}
                    tab={tab}
                    onSelect={(tab) => {
                      setProps({});
                      selectTab(tab);
                    }}
                  />
                  <Content>{render(component(), tab(), props)}</Content>
                  <PropTypesEditor>
                    <Column>
                      <For each={Object.keys(propTypes())}>
                        {(key) => (
                          <Switch
                            fallback={
                              <Typography variant="legacy-settings-description">
                                {key}:{" "}
                                {JSON.stringify(propTypes()[key as never])}
                              </Typography>
                            }
                          >
                            <Match
                              when={
                                propTypes()[key as never] === "string" ||
                                propTypes()[key as never] === "number"
                              }
                            >
                              <Typography variant="label">{key}</Typography>
                              <Input
                                value={currentProps()[key as never]}
                                type={
                                  propTypes()[key as never] === "string"
                                    ? "text"
                                    : "number"
                                }
                                onInput={(e) =>
                                  setProps({
                                    ...currentProps(),
                                    [key]:
                                      propTypes()[key as never] === "string"
                                        ? e.currentTarget.value
                                        : parseInt(e.currentTarget.value),
                                  })
                                }
                                palette="secondary"
                              />
                            </Match>
                            <Match
                              when={propTypes()[key as never] === "boolean"}
                            >
                              <Checkbox
                                value={currentProps()[key as never]}
                                onChange={(v) =>
                                  setProps({
                                    ...currentProps(),
                                    [key]: v,
                                  })
                                }
                                title={key}
                              />
                            </Match>
                            <Match
                              when={Array.isArray(propTypes()[key as never])}
                            >
                              <Typography variant="label">{key}</Typography>
                              <ComboBox
                                value={currentProps()[key as never]}
                                onInput={(e) =>
                                  setProps({
                                    ...currentProps(),
                                    [key]:
                                      e.currentTarget.value === "true"
                                        ? true
                                        : e.currentTarget.value === "false"
                                        ? false
                                        : e.currentTarget.value,
                                  })
                                }
                              >
                                <For each={propTypes()[key as never]}>
                                  {(entry: string | boolean) => (
                                    <option>
                                      {entry === true
                                        ? "true"
                                        : entry === false
                                        ? "false"
                                        : entry}
                                    </option>
                                  )}
                                </For>
                              </ComboBox>
                            </Match>
                          </Switch>
                        )}
                      </For>
                    </Column>
                  </PropTypesEditor>
                </Show>
              </Column>
            </Row>
          </Container>
        </ThemeProvider>
      </I18nContext.Provider>
    </div>
  );
}, document.getElementById("root") as HTMLElement);
