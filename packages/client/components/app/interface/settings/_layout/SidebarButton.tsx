import { styled } from "styled-system/jsx";

/**
 * Sidebar button
 */
export const SidebarButton = styled("a", {
  base: {
    minWidth: 0,

    display: "flex",
    alignItems: "center",
    padding: "6px 8px",
    borderRadius: "8px",
    fontWeight: 500,
    marginInlineEnd: "12px",
    fontSize: "15px",
    userSelect: "none",
    transition: "background-color 0.1s ease-in-out",
    color: "var(--colours-settings-sidebar-foreground)",
    background: "unset",

    "& svg": {
      flexShrink: 0,
    },

    "&:hover": {
      backgroundColor: "var(--colours-settings-sidebar-button-hover)",
    },

    "&:active": {
      backgroundColor: "var(--colours-settings-sidebar-button-active)",
    },
  },
  variants: {
    "aria-selected": {
      true: {
        background: "var(--colours-settings-sidebar-button-hover)",
      },
    },
  },
});

export const SidebarButtonTitle = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexGrow: 1,
    minWidth: 0,
    paddingInlineEnd: "8px",
  },
});

export const SidebarButtonContent = styled("div", {
  base: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
  },
});

export const SidebarButtonIcon = styled("div", {
  base: {
    display: "flex",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    flexShrink: 0,
    gap: "2px",
  },
});
