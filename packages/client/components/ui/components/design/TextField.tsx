import type { JSX } from "solid-js";

import "mdui/components/select.js";
import "mdui/components/text-field.js";

type Props = JSX.HTMLAttributes<HTMLInputElement> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
};

/**
 * Text fields let users enter text into a UI
 *
 * @library MDUI
 * @specification https://m3.material.io/components/text-fields
 */
export function TextField(props: Props) {
  return (
    <mdui-text-field
      {...props}
      // @codegen directives props=props include=autoComplete
    />
  );
}

function Select(
  props: JSX.HTMLAttributes<HTMLInputElement> & {
    value?: string;
    variant?: "filled" | "outlined";
    required?: boolean;
    disabled?: boolean;
  },
) {
  return <mdui-select {...props} />;
}

/**
 * Select menu allows the user to pick a menu item
 *
 * Use the `MenuItem` component as the child:
 * ```tsx
 * <TextField.Select>
 *   <MenuItem value="itemA">hello!</MenuItem>
 *   <MenuItem value="itemB">world!</MenuItem>
 * </TextField.Select>
 * ```
 *
 * @library MDUI
 * @specification https://m3.material.io/components/menus
 */
TextField.Select = Select;
