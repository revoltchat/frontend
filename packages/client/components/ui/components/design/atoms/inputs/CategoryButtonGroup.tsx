import { styled } from "styled-system/jsx";

/**
 * Group a set of category buttons (M3+Fluent)
 */
export const CategoryButtonGroup = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--gap-xs)",

    borderRadius: "var(--borderRadius-xl)",
    overflow: "hidden",
  },
});
