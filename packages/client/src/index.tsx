/**
 * Configure contexts and render App
 */
import { render } from "solid-js/web";

import i18n, { I18nContext } from "@revolt/i18n";
import { ModalRenderer } from "@revolt/modal";
import { Router } from "@revolt/routing";
import { Hydrate, state } from "@revolt/state";
import {
  ApplyGlobalStyles,
  FloatingManager,
  KeybindsProvider,
  Masks,
  ProvideDirectives,
  ThemeProvider,
  darkTheme,
} from "@revolt/ui";

/* @refresh reload */
import "@revolt/ui/styles";

import App from "./App";
import "./sentry";

import { attachDevtoolsOverlay } from "@solid-devtools/overlay";

attachDevtoolsOverlay();

render(
  () => (
    <Hydrate>
      <Masks />
      <Router>
        <I18nContext.Provider value={i18n}>
          <ThemeProvider theme={darkTheme}>
            <ProvideDirectives>
              <KeybindsProvider keybinds={() => state.keybinds.getKeybinds()}>
                <App />
              </KeybindsProvider>
              <ModalRenderer />
              <FloatingManager />
              <ApplyGlobalStyles />
            </ProvideDirectives>
          </ThemeProvider>
        </I18nContext.Provider>
      </Router>
    </Hydrate>
  ),
  document.getElementById("root") as HTMLElement
);
