import { describe, it, expect } from "vitest";
import { render, screen } from "solid-testing-library";

import context, { I18nContext, useTranslation } from "..";

const TranslatedText = () => {
  const t = useTranslation();

  return <div>{t("login.welcome")}</div>;
};

describe("Translation component", () => {
  it("should translate the text", () => {
    render(() => (
      <I18nContext.Provider value={context}>
        <TranslatedText />
      </I18nContext.Provider>
    ));

    const textElm = screen.getByText("Welcome back!");
    expect(textElm).toBeInTheDocument();
  });
});
