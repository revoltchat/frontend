import { type IFormControl, IFormGroup } from "solid-forms";
import { ComponentProps, For, type JSX, Show, splitProps } from "solid-js";

import { Trans } from "@lingui-solid/solid/macro";

import { Button, Text } from "../design";
import { TextField } from "../material";

import { FileInput } from "./files";

/**
 * Form wrapper for TextField
 */
const FormTextField = (
  props: {
    control: IFormControl<string>;
  } & ComponentProps<typeof TextField>,
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
        onchange={() => local.control.markDirty(true)}
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

/**
 * Form wrapper for, single file, FileInput
 */
const FormFileInput = (
  props: {
    label?: string;
    control: IFormControl<File[] | string | null>;
  } & Pick<
    ComponentProps<typeof FileInput>,
    "accept" | "imageAspect" | "imageRounded" | "imageJustify"
  >,
) => {
  const [local, remote] = splitProps(props, ["label", "control"]);

  return (
    <>
      <Show when={local.label}>
        <Text class="label">{local.label}</Text>
      </Show>
      <FileInput
        {...remote}
        file={local.control.value}
        onFiles={(files) => {
          // TODO: do validation of files here

          local.control.setValue(files);
          local.control.markDirty(true);
        }}
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

/**
 * Form reset button
 */
const FormResetButton = (props: {
  group: IFormGroup;
  onReset: () => void;
  children?: JSX.Element;
}) => {
  return (
    <Button
      variant="plain"
      onPress={() => {
        resetGeneric(props.group);
        props.onReset();
      }}
      isDisabled={!props.group.isDirty}
    >
      {props.children ?? <Trans>Reset</Trans>}
    </Button>
  );
};

/**
 * Form submission button
 */
const FormSubmitButton = (props: {
  group: IFormGroup;
  children: JSX.Element;
}) => {
  return (
    <Button type="submit" isDisabled={!props.group.isDirty}>
      {props.children}
    </Button>
  );
};

/**
 * Generic 'reset' of form group
 * @param group Form Group
 */
function resetGeneric(group: IFormGroup) {
  for (const control of Object.values(group.controls)) {
    control.markDirty(false);
    control.markTouched(false);
  }

  group.markPending(false);
  group.markSubmitted(true);
}

/**
 * Create a new submission handler
 * @param group Form Group
 * @param handler Handler for submission
 * @param onReset Handler to reset form state
 * @returns Function for onSubmit handler of form
 */
function submitHandler(
  group: IFormGroup,
  handler: () => Promise<void> | void,
  onReset?: () => void,
) {
  return async (e: Event) => {
    e.preventDefault();

    for (const control of Object.values(group.controls)) {
      control.markTouched(true);
    }

    if (group.isPending || !group.isValid) return;

    group.markPending(true);

    try {
      await handler();
    } catch (err) {
      group.setErrors({
        error: err,
      });
    } finally {
      group.markPending(false);
      resetGeneric(group);
      onReset?.();
    }
  };
}

export const Form2 = {
  TextField: FormTextField,
  FileInput: FormFileInput,
  Reset: FormResetButton,
  Submit: FormSubmitButton,
  submitHandler,
};
