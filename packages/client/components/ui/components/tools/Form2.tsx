import {
  Show,
  For,
  mergeProps,
  type Component,
  splitProps,
  ComponentProps,
} from "solid-js";
import { createFormControl, IFormGroup, type IFormControl } from "solid-forms";
import { TextField } from "../material";

const FormTextField = (
  props: {
    control: IFormControl<string>;
  } & ComponentProps<typeof TextField>
) => {
  const [local, remote] = splitProps(props, ["control"]);

  return (
    <>
      <TextField
        {...remote}
        value={local.control.value}
        oninput={(e) => {
          local.control.setValue(e.currentTarget.value);
        }}
        onblur={() => local.control.markTouched(true)}
        required={local.control.isRequired}
        disabled={local.control.isDisabled}
      />

      <Show when={local.control.isTouched && !local.control.isValid}>
        <For each={Object.keys(local.control.errors!)}>
          {(errorMsg: string) => <small>{errorMsg}</small>}
        </For>
      </Show>
    </>
  );
};

const SampleTextInput: Component<{
  control?: IFormControl<string>;
  name?: string;
  type?: string;
}> = (props) => {
  // here we provide a default form control in case the user doesn't supply one
  let localProps = mergeProps(
    { control: createFormControl(""), type: "text" },
    props
  );

  return (
    <div
      classList={{
        "is-invalid": !!localProps.control.errors,
        "is-touched": localProps.control.isTouched,
        "is-required": localProps.control.isRequired,
        "is-disabled": localProps.control.isDisabled,
      }}
    >
      <input
        name={localProps.name}
        type={localProps.type}
        value={localProps.control.value}
        oninput={(e) => {
          localProps.control.setValue(e.currentTarget.value);
        }}
        onblur={() => localProps.control.markTouched(true)}
        required={localProps.control.isRequired}
        disabled={localProps.control.isDisabled}
      />

      <Show when={localProps.control.isTouched && !localProps.control.isValid}>
        <For each={Object.values(localProps.control.errors!)}>
          {(errorMsg: string) => <small>{errorMsg}</small>}
        </For>
      </Show>
    </div>
  );
};

function submitHandler(group: IFormGroup, handler: () => Promise<void>) {
  return async (e: Event) => {
    e.preventDefault();

    for (const control of Object.values(group.controls)) {
      control.markTouched(true);
    }

    if (group.isSubmitted || !group.isValid) return;

    group.markSubmitted(true);
  };
}

export const Form2 = {
  TextField: FormTextField,
  submitHandler,
};
