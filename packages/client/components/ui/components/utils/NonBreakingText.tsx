import { styled } from "styled-system/jsx";

/**
 * Container to prevent text breaking
 */
export const NonBreakingText = styled("div", {
  base: {
    whiteSpace: "nowrap",

    "& *": {
      whiteSpace: "nowrap",
    },
  },
});
