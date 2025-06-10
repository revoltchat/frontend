import type { JSX } from "solid-js";

import "mdui/components/checkbox.js";

interface Props {
  children?: JSX.Element;
  required?: boolean;
  name?: string;
  checked?: boolean;
  disabled?: boolean;
  indeterminate?: boolean;
  class?: string;
  onChange?: (value: boolean) => void;
}

/**
 * Checkboxes let users select one or more items from a list, or turn an item on or off
 *
 * @library MDUI
 * @specification https://m3.material.io/components/checkbox
 */
export function Checkbox(props: Props) {
  return <mdui-checkbox {...props} />;
}
