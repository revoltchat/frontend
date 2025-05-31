import { cva } from "styled-system/css";

export const main = cva({
  base: {
    flexGrow: 1,
    minWidth: 0,
    minHeight: 0,

    display: "flex",
    overflow: 'hidden',
    flexDirection: "column",

    paddingInline: "var(--gap-md)",
    marginBlockEnd: "var(--gap-md)",
    marginInlineEnd: "var(--gap-md)",
    borderRadius: "var(--borderRadius-xl)",
    background: "var(--md-sys-color-surface-container-lowest)",
  },
});
