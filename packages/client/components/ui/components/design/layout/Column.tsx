import { styled } from "styled-system/jsx";

/**
 * Generic Flex Column
 */
export const Column = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    flexGrow: "initial",
    gap: "var(--gap-md)",
    margin: "0",
    alignItems: "initial",
    justifyContent: "initial",
  },
  variants: {
    grow: {
      true: {
        flexGrow: 1,
      },
    },
    group: {
      true: {
        margin: "16px 0",
      },
    },
    align: {
      true: {
        alignItems: "center",
      },
      stretch: {
        alignItems: "stretch",
      },
    },
    justify: {
      true: {
        justifyContent: "center",
      },
      stretch: {
        justifyContent: "stretch",
      },
    },
    gap: {
      xs: { gap: "var(--gap-xs)" },
      s: { gap: "var(--gap-s)" },
      sm: { gap: "var(--gap-sm)" },
      md: { gap: "var(--gap-md)" },
      lg: { gap: "var(--gap-lg)" },
      xl: { gap: "var(--gap-xl)" },
    },
  },
});
