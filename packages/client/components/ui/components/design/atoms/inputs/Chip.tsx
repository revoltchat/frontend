import { styled } from "styled-system/jsx";

import { Row } from "../../layout";
import { generateTypographyCSS } from "../display/Typography";

/**
 * Chip (M3)
 */
export const Chip = styled(Row, {
  base: {
    alignItems: "center",
    flexShrink: 0,
    gap: "var(--gap-s)",
    borderRadius: "var(--borderRadius-md)",
    background: "var(--colours-component-chip-background)",
    padding: "var(--gap-sm) var(--gap-s)",
    // TODO: ...generateTypographyCSS("chip"),
  },
});
