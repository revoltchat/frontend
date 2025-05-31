import type { JSX } from "solid-js";

import "mdui/components/checkbox.js";

export function Checkbox2(
  props: /*JSX.HTMLAttributes<HTMLInputElement> &*/ {
    children?: JSX.Element;
    required?: boolean;
    name?: string;
    checked?: boolean;
    indeterminate?: boolean;
    onChange?: (value: boolean) => void;
  },
) {
  return <mdui-checkbox {...props} />;
}
