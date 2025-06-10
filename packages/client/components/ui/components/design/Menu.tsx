import type { JSX } from "solid-js";

import "mdui/components/menu-item.js";

/**
 * Single item that appears in a menu
 *
 * @library MDUI
 * @specification https://m3.material.io/components/menus
 */
export function MenuItem(
  props: JSX.HTMLAttributes<HTMLInputElement> & {
    value?: string;
  },
) {
  return <mdui-menu-item {...props} />;
}
