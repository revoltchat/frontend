/**
 * Configure contexts and render App
 */
import { render } from "solid-js/web";

import i18n, { I18nContext } from "@revolt/i18n";
import { ModalRenderer } from "@revolt/modal";
import { Router } from "@revolt/routing";
import { Hydrate } from "@revolt/state";
import {
  ApplyGlobalStyles,
  FloatingManager,
  Masks,
  ProvideDirectives,
  ThemeProvider,
  darkTheme,
} from "@revolt/ui";


/* @refresh reload */
import "@revolt/ui/styles";

import App from "./App";
import "./sentry";

// TODO: move this somewhere more fitting
import { KeybindHandler } from "./Keybinds";

render(
  () => (
    <Hydrate>
      <Masks />
      <Router>
        <I18nContext.Provider value={i18n}>
          <ThemeProvider theme={darkTheme}>
            <ProvideDirectives>
              <App />
              <ModalRenderer />
              <FloatingManager />
              <ApplyGlobalStyles />
              <KeybindHandler />
            </ProvideDirectives>
          </ThemeProvider>
        </I18nContext.Provider>
      </Router>
    </Hydrate>
  ),
  document.getElementById("root") as HTMLElement
);
