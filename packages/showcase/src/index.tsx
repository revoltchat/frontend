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
`;

render(() => {
  const [component, select] = createSignal<keyof typeof components | undefined>();

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
            <Tabs tabs={tabs} tab={() => "a"} onSelect={() => {}} />
            <Content>
              {component()}
            </Content>
          </Column>
        </Row>
        </Container>
      </ThemeProvider>
    </div>
  );
}, document.getElementById("root") as HTMLElement);
