/* @refresh reload */
import "@revolt/ui/styles.css";

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

import { ThemeProvider, darkTheme } from "@revolt/ui";
import i18n, { I18nContext } from "@revolt/i18n";
import { Router } from "@solidjs/router";
import App from "./App";

render(
  () => (
    <Router>
      <I18nContext.Provider value={i18n}>
        <ThemeProvider theme={darkTheme}>
          <App />
        </ThemeProvider>
      </I18nContext.Provider>
    </Router>
  ),
  document.getElementById("root") as HTMLElement
);
