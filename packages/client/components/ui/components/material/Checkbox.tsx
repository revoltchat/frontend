import type { JSX } from "solid-js";

import "mdui/components/checkbox.js";

export function Checkbox2(
  props: JSX.HTMLAttributes<HTMLInputElement> & {
    required?: boolean;
    name?: string;
  }
) {
  return <mdui-checkbox {...props} />;
}
