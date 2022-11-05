import { describe, it, expect } from "vitest";
import { screen } from "solid-testing-library";
import { renderWithContext } from "../../../packages/test-runner/middleware";

import { useTranslation } from "..";

const TranslatedText = () => {
  const t = useTranslation();

  return <div>{t("login.welcome")}</div>;
};

describe("Translation component", () => {
  it("should translate the text", () => {
    renderWithContext(() => <TranslatedText />);

    const textElm = screen.getByText("Welcome back!");
    expect(textElm).toBeInTheDocument();
  });
});
