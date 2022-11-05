import { describe, it, expect } from "vitest";
import { screen } from "solid-testing-library";
import { renderWithContext } from "../../../../packages/test-runner/middleware";

import FlowCheck, { setFlowCheckEmail } from "../flows/FlowCheck";

describe("FlowCheck component", () => {
  it("should show the correct email provider hint", () => {
    setFlowCheckEmail("postmaster@revolt.wtf");
    renderWithContext(() => <FlowCheck />);

    const textElm = screen.getByText("Open Revolt Mail");
    expect(textElm).toBeInTheDocument();
  });
});
