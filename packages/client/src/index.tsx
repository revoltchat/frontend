/// <reference path="../types/styled.d.ts" />

/* @refresh reload */
import "@revolt/ui/styles";

/**
 * Configure MobX
 */
import { Reaction } from "mobx";
import { enableExternalSource } from "solid-js";

let id = 0;
enableExternalSource((fn, trigger) => {
  const reaction = new Reaction(`externalSource@${++id}`, trigger);
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

import { ThemeProvider, darkTheme, Masks } from "@revolt/ui";
import i18n, { I18nContext } from "@revolt/i18n";
import { ModalRenderer } from "@revolt/modal";
import { Router } from "@revolt/routing";
import { Hydrate } from "@revolt/state";
import App from "./App";

render(
  () => (
    <Hydrate>
      <Router>
        <I18nContext.Provider value={i18n}>
          <ThemeProvider theme={darkTheme}>
            <App />
            <ModalRenderer />
          </ThemeProvider>
        </I18nContext.Provider>
        <Masks />
      </Router>
    </Hydrate>
  ),
  document.getElementById("root") as HTMLElement
);
