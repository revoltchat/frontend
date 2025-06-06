import type { JSX } from "solid-js";

import "mdui/components/menu-item.js";
import "mdui/components/select.js";

export function Select(
  props: JSX.HTMLAttributes<HTMLInputElement> & {
    value?: any;
    variant?: "filled" | "outlined";
  },
) {
  return <mdui-select {...props} />;
}

export function MenuItem(
  props: JSX.HTMLAttributes<HTMLInputElement> & {
    value?: any;
  },
) {
  return <mdui-menu-item {...props} />;
}
