/* @refresh reload */
import "@revolt/ui/styles";

/**
 * Configure contexts and render App
 */
import { render } from "solid-js/web";

import {
  ThemeProvider,
  darkTheme,
  Masks,
  Row,
  styled,
  ScrollContainer,
  Tabs,
  Column,
  MenuButton,
  Typography,
  Input,
  Checkbox,
  ComboBox,
} from "@revolt/ui";
import { SidebarBase } from "@revolt/ui/components/navigation/channels/common";
import { Accessor, createSignal, For, Match, Show, Switch } from "solid-js";

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

const Content = styled(ScrollContainer)`
  flex-grow: 1;
  padding: 1rem;
`;

const PropTypesEditor = styled(ScrollContainer)`
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
  const [props, setProps] = createSignal<any>({});

  const propTypes = () => components[component()!]?.propTypes ?? {};

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

  function render(
    component: string | undefined,
    tab: string,
    overwrittenProps: Accessor<any>
  ) {
    const entry = components[component!];
    if (entry) {
      let { component: Component, stories, effects, decorators } = entry;

      const story = stories.find((story) => story.title === tab);
      if (story) {
        if (story.component) {
          Component = story.component;
        }

        const effectProps: Record<string, (...args: any[]) => any> = {};
        if (effects) {
          for (const effect of Object.keys(effects)) {
            effectProps[effect] = (...args) =>
              setProps({
                ...overwrittenProps(),
                ...(effects as any)[effect](currentProps(), ...args),
              });
          }
        }

        let el = <Component {...currentProps()} {...effectProps} />;

        if (story.decorators) {
          for (const Decorator of story.decorators) {
            el = <Decorator>{el}</Decorator>;
          }
        }

        if (decorators) {
          for (const Decorator of decorators) {
            el = <Decorator>{el}</Decorator>;
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
      <ThemeProvider theme={darkTheme}>
        <Container>
          <Row gap="none" justify="stretch" grow>
            <Sidebar>
              <Column>
                <Typography variant="h3">COMPONENTS</Typography>
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
                            <Typography variant="subtitle">
                              {key}: {JSON.stringify(propTypes()[key as never])}
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
                          <Match when={propTypes()[key as never] === "boolean"}>
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
    </div>
  );
}, document.getElementById("root") as HTMLElement);
