import { enableExternalSource, Show } from "solid-js";

/**
 * Configure contexts and render App
 */
import { render } from "solid-js/web";

/**
 * Configure MobX
 */
import { Reaction } from "mobx";

import i18n, { I18nContext } from "@revolt/i18n";
import { ModalRenderer } from "@revolt/modal";
import { Router } from "@revolt/routing";
import { Hydrate } from "@revolt/state";
import { ApplyGlobalStyles, Masks, ThemeProvider, darkTheme, Titlebar, Column } from "@revolt/ui";
import { appWindow } from "@tauri-apps/api/window";

/* @refresh reload */
import "@revolt/ui/styles";

import App from "./App";
import "./sentry";

let id = 0;
enableExternalSource((fn, trigger) => {
  const reaction = new Reaction(`@${++id}`, trigger);
  return {
    track: (x) => {
      let next;
      reaction.track(() => (next = fn(x)));
      return next;
    },
    dispose: () => reaction.dispose(),
  };
});

render(
  () => (
    <Hydrate>
      <Masks />
      <Router>
        <I18nContext.Provider value={i18n}>
          <ThemeProvider theme={darkTheme}>
            <Column gap="none" style={{
              "min-height": "100vh",
              height: "100%"
            }}>
              <Show when={window.__TAURI__}>
                <Titlebar
                  isBuildDev={import.meta.env.DEV}
                  onMinimize={() => appWindow.minimize()}
                  onMaximize={() => appWindow.toggleMaximize()}
                  onClose={() => appWindow.hide()}
                />
              </Show>
              <App />
            </Column>

            <ModalRenderer />
            <ApplyGlobalStyles />
          </ThemeProvider>
        </I18nContext.Provider>
      </Router>
    </Hydrate>
  ),
  document.getElementById("root") as HTMLElement
);
