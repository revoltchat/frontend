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
import { createSignal, For } from "solid-js";

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

  function render(component: string | undefined, tab: string) {
    const entry = components[component!];
    if (entry) {
      const { component: Component, props, stories } = entry;

      const story = stories.find(story => story.title === tab);
      if (story) {
        return <Component {...props} {...story.props} />;
      }
    }

    return null;
  }

  return (
    <div style={{ background: "#111", height: "100%" }}>
      <Masks />
      <ThemeProvider theme={darkTheme}>
        <Container>
        <Row gap={0} justify="stretch" grow>
          <Sidebar>
            <Column>
              <Typography variant="h3">COMPONENTS</Typography>
              <For each={Object.keys(components)}>
                {entry => <Link onClick={() => select(entry)}><MenuButton attention={component() === entry ? 'selected' : 'normal'}>{entry}</MenuButton></Link>}
              </For>
            </Column>
          </Sidebar>
          <Column gap={0} grow>
            <Tabs tabs={tabs} tab={tab} onSelect={selectTab} />
            <Content>
              {render(component(), tab())}
            </Content>
          </Column>
        </Row>
        </Container>
      </ThemeProvider>
    </div>
  );
}, document.getElementById("root") as HTMLElement);
