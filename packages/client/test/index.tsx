import { type JSX, createMemo, createResource } from "solid-js";

import * as i18n from "@solid-primitives/i18n";
import { HashRouter } from "@solidjs/router";
import { render } from "@solidjs/testing-library";

import { I18nContext, dict, fetchLanguage, language } from "@revolt/i18n";
import { Masks, ThemeProvider, darkTheme } from "@revolt/ui";

/**
 * Inject Context above children
 */
export default function testMiddleware(children: () => JSX.Element) {
  const [dictionary] = createResource(language, fetchLanguage, {
    initialValue: i18n.flatten(dict.en),
  });

  const t = createMemo(() => i18n.translator(dictionary, i18n.resolveTemplate));

  return (
    <HashRouter>
      <I18nContext.Provider value={t()}>
        <ThemeProvider theme={darkTheme()}>{children()}</ThemeProvider>
      </I18nContext.Provider>
      <Masks />
    </HashRouter>
  );
}

/**
 * Render with context
 */
export function renderWithContext(children: () => JSX.Element) {
  return render(() => testMiddleware(() => children()));
}
