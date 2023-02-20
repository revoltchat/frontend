/// <reference path="../types/styled.d.ts" />

import "./sentry";

/* @refresh reload */
import "@revolt/ui/styles";

/**
 * Configure MobX
 */
import { Reaction } from "mobx";
import { enableExternalSource } from "solid-js";

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

/**
 * Configure contexts and render App
 */
import { render } from "solid-js/web";

import { ThemeProvider, darkTheme, Masks, ApplyGlobalStyles } from "@revolt/ui";
import i18n, { I18nContext } from "@revolt/i18n";
import { ModalRenderer } from "@revolt/modal";
import { Router } from "@revolt/routing";
import { Hydrate } from "@revolt/state";
import App from "./App";

render(
  () => (
    <Hydrate>
      <Masks />
      <Router>
        <I18nContext.Provider value={i18n}>
          <ThemeProvider theme={darkTheme}>
            <App />
            <ModalRenderer />
            <ApplyGlobalStyles />
          </ThemeProvider>
        </I18nContext.Provider>
      </Router>
    </Hydrate>
  ),
  document.getElementById("root") as HTMLElement
);
