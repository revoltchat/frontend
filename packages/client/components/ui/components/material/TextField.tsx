import type { JSX } from "solid-js";

import "mdui/components/text-field.js";

export function TextField(
  props: JSX.HTMLAttributes<HTMLInputElement> & {
    value?: any;
    required?: boolean;
    name?: string;
    label?: string;
    autosize?: boolean;
    disabled?: boolean;
    "min-rows"?: number;
    "max-rows"?: number;
    placeholder?: string;
    type?: "text" | "password" | "email" | "file";
    variant?: "filled" | "outlined";
  }
) {
  return <mdui-text-field {...props} />;
}
