import { Component, ComponentProps, JSX, splitProps } from "solid-js";

import { styled } from "styled-system/jsx";

import { iconSize } from "@revolt/ui";

export const ContextMenu = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    padding: "var(--gap-md) 0",
    overflow: "hidden",
    borderRadius: "var(--borderRadius-md)",
    background: "var(--colours-component-context-menu-background)",
    color: "var(--colours-component-context-menu-foreground)",
    fill: "var(--colours-component-context-menu-foreground)",
    boxShadow: "0 0 3px var(--colours-component-context-menu-shadow)",
  },
});

export const ContextMenuDivider = styled("div", {
  base: {
    height: "1px",
    margin: "var(--gap-sm) 0",
    background: "var(--colours-component-context-menu-divider)",
  },
});

export const ContextMenuItem = styled("a", {
  base: {
    display: "block",
    padding: "var(--gap-md) var(--gap-lg)",
    "&:hover": {
      background: "var(--colours-component-context-menu-item-hover-background)",
    },
  },
  variants: {
    button: {
      true: {
        display: "flex",
        alignItems: "center",
        gap: "var(--gap-md)",
        textTransform: "capitalize",
        "& span": {
          marginTop: "1px",
        },
      },
    },
    destructive: {
      true: {
        fill: "var(--customColours-error-color)",
        color: "var(--customColours-error-color)",
      },
    },
  },
});

type ButtonProps = ComponentProps<typeof ContextMenuItem> & {
  icon?: Component<JSX.SvgSVGAttributes<SVGSVGElement>>;
  destructive?: boolean;
};

export function ContextMenuButton(props: ButtonProps) {
  const [local, remote] = splitProps(props, ["icon", "children"]);

  return (
    <ContextMenuItem button {...remote}>
      {local.icon?.(iconSize("1.2em"))}
      <span>{local.children}</span>
    </ContextMenuItem>
  );
}
