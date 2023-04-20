import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";

/**
 * Example component
 */
const Timer = () => {
  return <div>5:30</div>;
};

describe("Timer component", () => {
  it("should render the timer", () => {
    render(() => <Timer />);
    const timerElm = screen.getByText("5:30");
    expect(timerElm).toBeInTheDocument();
    expect(timerElm.outerHTML).toMatchInlineSnapshot('"<div>5:30</div>"');
  });
});
