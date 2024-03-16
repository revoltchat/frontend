import { screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";

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
