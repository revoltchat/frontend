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

    userSelect: "none",
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
    action: {
      true: {
        cursor: "pointer",
      },
    },
    button: {
      true: {
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "var(--gap-md)",
        "& span": {
          marginTop: "1px",
        },
      },
    },
    _titleCase: {
      true: {},
      false: {},
    },
    destructive: {
      true: {
        fill: "var(--md-sys-color-error)",
        color: "var(--md-sys-color-error)",
      },
    },
  },
  defaultVariants: {
    _titleCase: true,
  },
  compoundVariants: [
    {
      _titleCase: true,
      button: true,
      css: {
        textTransform: "capitalize",
      },
    },
  ],
});

type ButtonProps = ComponentProps<typeof ContextMenuItem> & {
  icon?: JSX.Element | Component<JSX.SvgSVGAttributes<SVGSVGElement>>;
  destructive?: boolean;
};

export function ContextMenuButton(props: ButtonProps) {
  const [local, remote] = splitProps(props, ["icon", "children"]);

  return (
    <ContextMenuItem button {...remote}>
      {typeof local.icon === "function"
        ? local.icon?.(iconSize(16))
        : local.icon}
      <Text>{local.children}</Text>
    </ContextMenuItem>
  );
}
