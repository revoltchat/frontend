/* eslint-disable */
// TODO: finish implementation; then remove eslint-disable
import {
  Accessor,
  ComponentProps,
  For,
  JSX,
  Match,
  Show,
  Switch,
  splitProps,
} from "solid-js";

import {
  // ColourSwatches,
  Column,
  ComboBox,
  FormGroup,
  Input,
  LegacyCheckbox,
  Radio,
  Typography,
} from "../design";

// inputs:
// - checkbox (bool)
// - colour swatches (string)
// - combobox (string)
// - inputbox (string)
// - override (tri-state) [to implement]
// - radio (string)
// - textarea (string) [to implement]

/**
 * Available input types
 */
export type Type =
  | "text"
  | "password"
  | "checkbox"
  // | "colour"
  | "combo"
  | "radio"
  // | "textarea"
  | "custom";

/**
 * Get default value
 */
export function emptyValue(type: Type) {
  return type === "custom" ? undefined : type === "checkbox" ? false : "";
}

/**
 * Component props
 */
type Props<T extends Type> = {
  type: T;
  value: Accessor<Value<T>>;
  onChange: (v: Value<T>) => void;
  disabled?: boolean;
} & TypeProps<T>;

/**
 * Multi or single-select choice entry
 */
type Choice = {
  value: string;
  name: JSX.Element;
  disabled?: boolean;
  selected?: boolean;
};

/**
 * Metadata for different input types
 */
type Metadata = {
  text: { value: string; props: ComponentProps<typeof Input> };
  password: { value: string; props: ComponentProps<typeof Input> };
  checkbox: { value: boolean; props: ComponentProps<typeof LegacyCheckbox> };
  /*colour: {
        value: string;
        props: ComponentProps<typeof ColourSwatches>;
    };*/
  combo: {
    value: string;
    props: Omit<ComponentProps<typeof ComboBox>, "children"> & {
      options: Choice[];
    };
  };
  radio: {
    value: string;
    props: {
      choices: (Choice &
        Omit<ComponentProps<typeof Radio>, "title" | "value">)[];
    };
  };
  // textarea: { value: string; props: ComponentProps<typeof TextArea> };
  custom: { value: never; props: { element: JSX.Element } };
};

/**
 * Actual input value type
 */
export type Value<T extends Type> = Metadata[T]["value"];

/**
 * Additional component props for given input type
 */
export type TypeProps<T extends Type> = Omit<
  Metadata[T]["props"],
  "value" | "onChange"
> & {
  field?: JSX.Element;
};

/**
 * Generic input element
 */
export function InputElement<T extends Type>(props: Props<T>) {
  const [localProps, innerProps] = splitProps(props, [
    "type",
    "value",
    "onChange",
  ]);

  return (
    <FormGroup>
      <Show when={innerProps.field}>
        <Typography variant="label">{innerProps.field}</Typography>
      </Show>
      <Switch>
        <Match when={localProps.type === "text"}>
          <Input
            value={localProps.value() as string}
            onChange={(ev) =>
              localProps.onChange(ev.currentTarget.value as Value<T>)
            }
            {...innerProps}
          />
        </Match>
        <Match when={localProps.type === "password"}>
          <Input
            type="password"
            value={localProps.value() as string}
            onChange={(ev) =>
              localProps.onChange(ev.currentTarget.value as Value<T>)
            }
            {...innerProps}
          />
        </Match>
        <Match when={localProps.type === "checkbox"}>
          <LegacyCheckbox
            value={localProps.value() as boolean}
            onChange={(value) => localProps.onChange(value as Value<T>)}
            {...innerProps}
          />
        </Match>
        {/*<Match when={localProps.type === "colour"}>
          <ColourSwatches
            value={value()}
            onChange={(value) => onChange(value as Value<T>)}
            {...innerProps}
          />
        </Match>*/}
        <Match when={localProps.type === "combo"}>
          <ComboBox
            value={localProps.value() as string}
            onChange={(ev) =>
              localProps.onChange(ev.currentTarget.value as Value<T>)
            }
            {...innerProps}
          >
            <For each={(innerProps as unknown as Props<"combo">).options}>
              {(option) => (
                <option
                  value={option.value}
                  disabled={option.disabled}
                  selected={option.selected}
                >
                  {option.name}
                </option>
              )}
            </For>
          </ComboBox>
        </Match>
        <Match when={localProps.type === "radio"}>
          <Column>
            <For each={(innerProps as unknown as Props<"radio">).choices}>
              {(choice) => (
                <Radio
                  title={choice.name}
                  value={choice.value === props.value()}
                  onSelect={() => localProps.onChange(choice.value)}
                  {...innerProps}
                />
              )}
            </For>
          </Column>
        </Match>
        <Match when={localProps.type === "custom"}>
          {(innerProps as unknown as Props<"custom">).element}
        </Match>
      </Switch>
    </FormGroup>
  );
}
