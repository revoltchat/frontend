import type { JSX } from "solid-js";

import "mdui/components/text-field.js";

export function TextField(
  props: JSX.HTMLAttributes<HTMLInputElement> & {
    required?: boolean;
    name?: string;
    label?: string;
    placeholder?: string;
    variant?: "filled" | "outlined";
  }
) {
  return <mdui-text-field {...props} />;
}
