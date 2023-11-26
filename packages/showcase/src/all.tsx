/* @refresh reload */
import { For } from "solid-js";

/**
 * Configure contexts and render App
 */
import { render } from "solid-js/web";

import i18n, { I18nContext } from "@revolt/i18n";
import {
  ApplyGlobalStyles,
  Column,
  Masks,
  ThemeProvider,
  darkTheme,
  styled,
} from "@revolt/ui";
import "@revolt/ui/styles";

import components from "./stories";

const ElementContainer = styled.div`
  width: fit-content;
`;

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

/**
 * Whether we should render this component
 * @param key Key
 * @returns Condition
 */
function shouldRender(key: string) {
  const filter = params["filter"];
  return filter ? filter === key : true;
}

render(() => {
  /**
   * Render a given component
   * @param component Component
   * @param tab Tab
   * @returns Element
   */
  function render(component: string | undefined, tab: string) {
    const entry = components[component!];
    if (entry) {
      let { component: Component } = entry;
      const { props, stories, decorators } = entry;

      const story = stories.find((story) => story.title === tab);
      if (story && !story.skipRegressionTests) {
        if (story.component) {
          Component = story.component;
        }

        if (!Component) {
          return <h1>Component is null!</h1>;
        }

        let el = <Component {...props} {...story.props} />;

        if (story.decorators) {
          for (const Decorator of story.decorators) {
            el = (
              <Decorator childProps={{ ...props, ...story.props }}>
                {el}
              </Decorator>
            );
          }
        }

        if (decorators) {
          for (const Decorator of decorators) {
            el = (
              <Decorator childProps={{ ...props, ...story.props }}>
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
    <div style={{ background: "black" }}>
      <Masks />
      <I18nContext.Provider value={i18n}>
        <ThemeProvider theme={darkTheme()}>
          <ApplyGlobalStyles />
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
      </I18nContext.Provider>
    </div>
  );
}, document.getElementById("all") as HTMLElement);
