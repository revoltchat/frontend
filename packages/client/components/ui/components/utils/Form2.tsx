import { type IFormControl, IFormGroup } from "solid-forms";
import { ComponentProps, For, type JSX, Show, splitProps } from "solid-js";

import { Trans } from "@lingui-solid/solid/macro";
import { VirtualContainer } from "@minht11/solid-virtual-container";
import { css } from "styled-system/css";

import { Button, Checkbox, Text, TextField } from "../design";

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
    "accept" | "imageAspect" | "imageRounded" | "imageJustify" | "allowRemoval"
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
 * Form element for virtual selection
 */
function FormVirtualSelect<K, T>(props: {
  control: IFormControl<K[]>;
  items: { item: T; value: K }[];
  children: (item: T) => JSX.Element;
  itemHeight?: number;
}) {
  let ref;

  return (
    <div ref={ref} use:scrollable={{ class: css({ height: "320px" }) }}>
      <VirtualContainer
        items={props.items}
        scrollTarget={ref}
        itemSize={{ height: props.itemHeight ?? 40 }}
      >
        {(item) => (
          <div
            style={{
              ...item.style,
              width: "100%",
            }}
          >
            <Checkbox
              class={css({ width: "100%" })}
              onChange={(checked) =>
                props.control.setValue([
                  ...props.control.value.filter(
                    (entry) => entry !== item.item.value,
                  ),
                  ...(checked ? [item.item.value] : []),
                ])
              }
              checked={props.control.value.includes(item.item.value)}
            >
              {props.children(item.item.item)}
            </Checkbox>
          </div>
        )}
      </VirtualContainer>
    </div>
  );
}

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
        resetGeneric(props.group, true);
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
  function canSubmit() {
    if (props.group.isDisabled) return false;
    if (!props.group.isDirty) return false;

    for (const control in props.group.controls) {
      const element = props.group.controls[control];
      if (element.isRequired && !element.value) return false;
    }

    return true;
  }

  return (
    <Button type="submit" isDisabled={!canSubmit()}>
      {props.children}
    </Button>
  );
};

/**
 * Generic 'reset' of form group
 * @param group Form Group
 * @param includingFields Whether to also reset fields
 */
function resetGeneric(group: IFormGroup, includingFields: boolean) {
  if (includingFields) {
    for (const control of Object.values(group.controls)) {
      control.markDirty(false);
      control.markTouched(false);
    }
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
      resetGeneric(group, true);
      onReset?.();
    } catch (err) {
      group.setErrors({
        error: err,
      });

      resetGeneric(group, false);
    } finally {
      group.markPending(false);
    }
  };
}

export const Form2 = {
  TextField: FormTextField,
  FileInput: FormFileInput,
  VirtualSelect: FormVirtualSelect,
  Reset: FormResetButton,
  Submit: FormSubmitButton,
  submitHandler,
};
