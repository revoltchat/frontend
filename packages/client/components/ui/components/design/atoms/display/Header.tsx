import { styled } from "styled-system/jsx";

export interface Props {
  readonly placement: "primary" | "secondary";

  readonly topBorder?: boolean;
  readonly bottomBorder?: boolean;
}

/**
 * Generic header component
 */
export const Header = styled("div", {
  base: {
    gap: "10px",
    flex: "0 auto",
    display: "flex",
    flexShrink: 0,
    padding: "0 16px",
    alignItems: "center",
    fontWeight: 600,
    userSelect: "none",
    overflow: "hidden",
    height: "var(--layout-height-header)",
    borderRadius: "var(--borderRadius-lg)",
    color: "var(--colours-sidebar-header-foreground)",
    backgroundColor: "var(--colours-sidebar-header-background)",
    backgroundSize: "cover !important",
    backgroundPosition: "center !important",
    "& svg": {
      flexShrink: 0,
    },
  },
  variants: {
    placement: {
      primary: {
        margin: "var(--gap-md) var(--gap-md) var(--gap-md) 0",
      },
      secondary: {},
    },
    image: {
      true: {
        padding: 0,
        alignItems: "flex-end",
        justifyContent: "stretch",
        textShadow: "0px 0px 1px var(--colours-foreground)",
        height: "var(--layout-height-tall-header)",
        margin: "var(--gap-md)",

        "& > div": {
          flexGrow: 1,
          padding: "6px 14px",
          color: "var(--colours-sidebar-header-with-image-text-foreground)",
          background:
            "linear-gradient(0deg, var(--colours-sidebar-header-with-image-text-background), transparent)",
        },
      },
      false: {},
    },
    transparent: {
      true: {
        // backgroundColor: "var(--colours-sidebar-header-transparent-background)",
        // backdropFilter: "var(--effects-blur-md)",
        // position: "absolute",
        width: "calc(100% - var(--gap-md))",
        zIndex: "var(--layout-zIndex-floating-bar)",
      },
      false: {},
    },
  },
  defaultVariants: {
    placement: "primary",
    image: false,
    transparent: false,
  },
});

/**
 * Position an element below a floating header
 *
 * Ensure you place a div inside to make the positioning work
 */
export const BelowFloatingHeader = styled("div", {
  base: {
    position: "relative",
    zIndex: "var(--layout-zIndex-floating-bar)",

    // i guess this works, probably refactor this later
    "& > div div": {
      width: "100%",
      position: "absolute",
      top: "var(--gap-md)",
    },
  },
});
