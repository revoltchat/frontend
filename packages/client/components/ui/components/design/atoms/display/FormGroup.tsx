import { styled } from "styled-system/jsx";

/**
 * Input element and label grouping
 */
export const FormGroup = styled("label", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--gap-md)",
  },
});
