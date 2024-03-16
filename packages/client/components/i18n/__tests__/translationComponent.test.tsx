import { screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";

import { useTranslation } from "..";
import { renderWithContext } from "../../../packages/test-runner/middleware";

const TranslatedText = () => {
  const t = useTranslation();

  return <div>{t("login.welcome")}</div>;
};

describe("Translation component", () => {
  it("should translate the text", () => {
    renderWithContext(() => <TranslatedText />);

    const textElm = screen.getByText("Welcome!");
    expect(textElm).toBeInTheDocument();
  });
});
