/**
 * Configure contexts and render App
 */
import { createComputed, createEffect, createSignal, on } from "solid-js";
import { createStore } from "solid-js/store";
import { render } from "solid-js/web";

import { attachDevtoolsOverlay } from "@solid-devtools/overlay";

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

attachDevtoolsOverlay();

/** TEMPORARY */
function MountTheme(props: { children: any }) {
  const [accent, setAccent] = createSignal("#FF5733");
  const [darkMode, setDarkMode] = createSignal(false);

  (window as any)._demo_setAccent = setAccent;
  (window as any)._demo_setDarkMode = setDarkMode;

  const [theme, setTheme] = createStore(darkTheme(accent(), darkMode()));

  createEffect(
    on(
      () => [accent(), darkMode()] as [string, boolean],
      ([accent, darkMode]) => setTheme(darkTheme(accent, darkMode))
    )
  );

  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
}
/** END TEMPORARY */

render(
  () => (
    <Hydrate>
      <Masks />
      <Router>
        <I18nContext.Provider value={i18n}>
          <MountTheme>
            <ProvideDirectives>
              <KeybindsProvider keybinds={() => state.keybinds.getKeybinds()}>
                <App />
              </KeybindsProvider>
              <ModalRenderer />
              <FloatingManager />
              <ApplyGlobalStyles />
            </ProvideDirectives>
          </MountTheme>
        </I18nContext.Provider>
      </Router>
    </Hydrate>
  ),
  document.getElementById("root") as HTMLElement
);
