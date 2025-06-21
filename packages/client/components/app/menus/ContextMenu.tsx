import { Component, ComponentProps, JSX, splitProps } from "solid-js";

import { styled } from "styled-system/jsx";

import { Text, iconSize } from "@revolt/ui";

export const ContextMenu = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    padding: "var(--gap-md) 0",
    overflow: "hidden",
    borderRadius: "var(--borderRadius-xs)",
    background: "var(--md-sys-color-surface-container)",
    color: "var(--md-sys-color-on-surface)",
    fill: "var(--md-sys-color-on-surface)",
    boxShadow: "0 0 3px var(--md-sys-color-shadow)",
  },
});

export const ContextMenuDivider = styled("div", {
  base: {
    height: "1px",
    margin: "var(--gap-sm) 0",
    background: "var(--md-sys-color-outline-variant)",
  },
});

export const ContextMenuItem = styled("a", {
  base: {
    display: "block",
    padding: "var(--gap-md) var(--gap-lg)",
    "&:hover": {
      background:
        "color-mix(in srgb, var(--md-sys-color-on-surface) 8%, transparent)",
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
      {local.icon?.(iconSize(16))}
      <Text>{local.children}</Text>
    </ContextMenuItem>
  );
}
