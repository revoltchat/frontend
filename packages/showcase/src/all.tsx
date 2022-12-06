/* @refresh reload */
import "@revolt/ui/styles";

/**
 * Configure contexts and render App
 */
import { render } from "solid-js/web";

import { For } from "solid-js";

import components from "./stories";
import { Column, darkTheme, Masks, styled, ThemeProvider } from "@revolt/ui";

const ElementContainer = styled.div`
  width: fit-content;
`;

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

function shouldRender(key: string) {
  const filter = params["filter"];
  return filter ? filter === key : true;
}

render(() => {
  function render(component: string | undefined, tab: string) {
    const entry = components[component!];
    if (entry) {
      const { component: Component, props, stories } = entry;

      const story = stories.find((story) => story.title === tab);
      if (story) {
        return <Component {...props} {...story.props} />;
      }
    }

    return null;
  }

  return (
    <div style="background:black">
      <Masks />
      <ThemeProvider theme={darkTheme}>
        <Column>
          <For each={Object.keys(components)}>
            {(key) =>
              shouldRender(key) ? (
                <ElementContainer id={key}>
                  <Column gap="sm">
                    <For each={components[key].stories}>
                      {({ title }) => (
                        <ElementContainer>
                          {render(key, title)}
                        </ElementContainer>
                      )}
                    </For>
                  </Column>
                </ElementContainer>
              ) : null
            }
          </For>
        </Column>
      </ThemeProvider>
    </div>
  );
}, document.getElementById("root") as HTMLElement);
