import { styled } from "styled-system/jsx";

/**
 * Common styles for sidebar
 */
export const SidebarBase = styled("div", {
  base: {
    display: "flex",
    flexShrink: 0,
    flexDirection: "column",
    overflow: "hidden",
    borderRadius: "var(--borderRadius-lg)",
    margin: "var(--gap-md) var(--gap-md) var(--gap-md) 0",
    width: "var(--layout-width-channel-sidebar)",
    color: "var(--colours-sidebar-channels-foreground)",
    background: "var(--colours-sidebar-channels-background)",

    "& a": {
      textDecoration: "none",
    },
  },
});
