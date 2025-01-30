import { styled } from "styled-system/jsx";

/**
 * Container to break all text and prevent overflow from math blocks
 *
 * Use this to wrap Markdown
 */
export const BreakText = styled("div", {
  base: {
    wordBreak: "break-word",

    "& .math": {
      overflowX: "auto",
      overflowY: "hidden",
      maxHeight: "100vh",
    },
  },
});
