import { createMemo, createResource } from "solid-js";

import * as i18n from "@solid-primitives/i18n";
import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";

import { I18nContext, dict, fetchLanguage, language, useTranslation } from "..";

const TranslatedText = () => {
  const t = useTranslation();

  return <div>{t("login.welcome")}</div>;
};

describe("Translation component", () => {
  it("should translate the text", () => {
    const [dictionary] = createResource(language, fetchLanguage, {
      initialValue: i18n.flatten(dict.en),
    });

    const t = createMemo(() =>
      i18n.translator(dictionary, i18n.resolveTemplate)
    );

    render(() => (
      <I18nContext.Provider value={t()}>
        <TranslatedText />
      </I18nContext.Provider>
    ));

    const textElm = screen.getByText("Welcome!");
    expect(textElm).toBeInTheDocument();
  });
});
