import type { JSX } from "solid-js";

import "mdui/components/text-field.js";

export function TextField(
  props: JSX.HTMLAttributes<HTMLInputElement> & {
    value?: any;
    required?: boolean;
    name?: string;
    label?: string;
    placeholder?: string;
    type?: "text" | "password" | "email";
    variant?: "filled" | "outlined";
  }
) {
  return <mdui-text-field {...props} />;
}
