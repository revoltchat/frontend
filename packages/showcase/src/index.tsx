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
  Button,
  MenuButton,
  Typography,
} from "@revolt/ui";
import { SidebarBase } from "@revolt/ui/components/navigation/channels/common";
import { Accessor, createSignal, For } from "solid-js";

import components from './stories';

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

render(() => {
  const [component, select] = createSignal<keyof typeof components | undefined>();
  const [tab, selectTab] = createSignal('');
  const [props, setProps] = createSignal<any>({});

  const tabs = () => {
    const obj: Record<string, { label: string }> = {};
    const key = component();

    if (key) {
      const component = components[key];
      if (component.stories) {
        for (const story of component.stories) {
          obj[story.title] = {
            label: story.title
          };
        }
      }
    }

    return obj;
  }

  function render(component: string | undefined, tab: string, overwrittenProps: Accessor<any>) {
    const entry = components[component!];
    if (entry) {
      const { component: Component, props, stories, effects } = entry;

      const story = stories.find(story => story.title === tab);
      if (story) {
        const effectProps: Record<string, (...args: any[]) => any> = {};
        if (effects) {
          for (const effect of Object.keys(effects)) {
            effectProps[effect] = (...args) => setProps({...overwrittenProps(), ...(effects as any)[effect]({
              ...props,
              ...story.props,
              ...overwrittenProps()
            }, ...args)});
          }
        }

        return <Component {...props} {...story.props} {...overwrittenProps()} {...effectProps} />;
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
                {entry => <Link onClick={() => {
                  setProps({});
                  select(entry)
                  }}><MenuButton attention={component() === entry ? 'selected' : 'normal'}>{entry}</MenuButton></Link>}
              </For>
            </Column>
          </Sidebar>
          <Column gap="none" grow>
            <Tabs tabs={tabs} tab={tab} onSelect={tab => {
              setProps({});
              selectTab(tab);
            }} />
            <Content>
              {render(component(), tab(), props)}
            </Content>
          </Column>
        </Row>
        </Container>
      </ThemeProvider>
    </div>
  );
}, document.getElementById("root") as HTMLElement);
