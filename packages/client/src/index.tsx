/* @refresh reload */
import { render } from "solid-js/web";

import "./styles.css";

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
