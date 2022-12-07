import { describe, it, expect } from "vitest";
import { screen, render } from "solid-testing-library";

import { Time, formatTime } from "../Time";
import { dayjs } from "@revolt/i18n";

const REFERENCE_TIME = new Date("2022-12-09T20:27:50.000Z");

const TEST_DATA = [
  {
      value: new Date("2022-12-07T20:20:50.000Z"),
      format: "calendar" as "calendar",
      expected: "Today at 8:20 PM"
  },
  {
      value: new Date("2022-12-05T20:20:50.000Z"),
      format: "calendar" as "calendar",
      expected: "Last Monday at 8:20 PM"
  },
  {
      value: new Date("2022-12-01T20:20:50.000Z"),
      format: "time" as "time",
      expected: "20:20"
  }
];

describe("Time component", () => {
  it("should have correct output", () => {
    for (const entry of TEST_DATA) {
      expect(formatTime(entry)).toBe(entry.expected);
    }
  });

  it("should render the correct output", () => {
    for (const entry of TEST_DATA) {
      render(() => <Time {...entry} />);
      const textElm = screen.getByText(entry.expected);
      expect(textElm).toBeInTheDocument();
    }
  });
});
