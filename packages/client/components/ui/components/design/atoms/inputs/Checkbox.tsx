import { BiRegularCheck } from "solid-icons/bi";
import { createSignal } from "solid-js";

import { styled } from "styled-system/jsx";

export type Props = {
  readonly disabled?: boolean;

  readonly name?: string;
  readonly value?: boolean;
  readonly onChange?: (state: boolean) => void;
};

/**
 * Checkbox
 */
export function Checkbox(props: Props) {
  const [controlledValue, setControlledValue] = createSignal(false);
  const checked = () => props.value ?? controlledValue();

  return (
    <Checkmark value={checked()} class="checkmark">
      <BiRegularCheck size={20} class="check" />
      <Input
        name={props.name}
        type="checkbox"
        checked={checked()}
        onChange={() =>
          typeof props.value !== "undefined"
            ? !props.disabled && props.onChange?.(!props.value)
            : setControlledValue((v) => !v)
        }
      />
    </Checkmark>
  );
}
const Input = styled("input", {
  base: {
    display: "none",
  },
});

const Checkmark = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "24px",
    height: "24px",
    border: "2px solid var(--colours-component-checkbox-foreground)",
    borderRadius: "var(--borderRadius-md)",
    background: "var(--colours-component-checkbox-background)",
    flexShrink: 0,
    margin: "4px",
    transition: "0.1s ease-in-out all",

    "& .check": {
      transition: "inherit",
      fill: "var(--colours-component-checkbox-foreground-check)",
      visibility: "hidden",
      opacity: 0,
    },
  },

  variants: {
    value: {
      true: {
        borderColor: "var(--colours-component-checkbox-foreground)",
        background: "var(--colours-component-checkbox-foreground)",

        ".check": {
          visibility: "visible",
          opacity: 1,
          color: "var(--colours-component-checkbox-foreground-check)",
        },
      },
    },
  },
});
