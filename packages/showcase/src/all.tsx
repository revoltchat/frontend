/* @refresh reload */
import "@revolt/ui/styles";

/**
 * Configure contexts and render App
 */
import { render } from "solid-js/web";

import { For } from "solid-js";

import components from './stories';
import { Column, darkTheme, Masks, ThemeProvider } from "@revolt/ui";

render(() => {
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
      <Column>
        <For each={Object.keys(components)}>
          {key => <For each={components[key].stories}>
            {({title}) => <div id={key + '_' + title}>{render(key, title)}</div>}
          </For>}
        </For>
      </Column>
      </ThemeProvider>
    </div>
  );
}, document.getElementById("root") as HTMLElement);
