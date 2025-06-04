import type { JSX } from "solid-js";

import "mdui/components/text-field.js";

export function TextField(
  props: JSX.HTMLAttributes<HTMLInputElement> & {
    value?: any;
    autoFocus?: boolean;
    required?: boolean;
    name?: string;
    label?: string;
    autosize?: boolean;
    disabled?: boolean;
    rows?: number;
    "min-rows"?: number;
    "max-rows"?: number;
    placeholder?: string;
    type?: "text" | "password" | "email" | "file";
    variant?: "filled" | "outlined";
    enterkeyhint?:
      | "enter"
      | "done"
      | "go"
      | "next"
      | "previous"
      | "search"
      | "find";
  },
) {
  return (
    <mdui-text-field
      {...props}
      // @codegen directives props=props include=autoComplete
    />
  );
}
