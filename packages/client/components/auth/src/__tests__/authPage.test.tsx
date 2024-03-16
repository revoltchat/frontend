import { screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";

import { renderWithContext } from "../../../../packages/test-runner/middleware";
import { AuthPage } from "../AuthPage";

describe("AuthPage", () => {
  it("should start on the login page", () => {
    renderWithContext(() => <AuthPage />);

    expect(screen.getByText("Sign into Revolt")).toBeInTheDocument();
  });
});
