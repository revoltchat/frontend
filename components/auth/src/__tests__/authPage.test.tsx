import { describe, it, expect } from "vitest";
import { screen } from "solid-testing-library";
import { renderWithContext } from "../../../../packages/test-runner/middleware";

import { AuthPage } from "../AuthPage";

describe("AuthPage", () => {
  it("should start on the login page", () => {
    renderWithContext(() => <AuthPage />);

    expect(screen.getByText("Sign into Revolt")).toBeInTheDocument();
  });
});
