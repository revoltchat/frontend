import { styled } from "styled-system/jsx";

/**
 * Specific-width icon container
 */
export const InlineIcon = styled("div", {
  base: {
    display: "grid",
    flexShrink: 0,
    placeItems: "center",
  },
  variants: {
    size: {
      short: {
        width: "14px",
      },
      normal: {
        width: "42px",
      },
      wide: {
        width: "62px",
      },
    },
  },
});
