/* @refresh reload */
import { render } from "solid-js/web";

import "./styles.css";

import i18n, { I18nContext } from "@revolt/i18n";
import App from "./App";

render(
  () => (
    <I18nContext.Provider value={i18n}>
      <App />
    </I18nContext.Provider>
  ),
  document.getElementById("root") as HTMLElement
);
