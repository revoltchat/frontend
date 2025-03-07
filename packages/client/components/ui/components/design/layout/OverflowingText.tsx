import { styled } from "styled-system/jsx";

/**
 * Container to prevent text overflow
 */
export const OverflowingText = styled("div", {
  base: {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",

    "& *": {
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
    },
  },
});
