import { Show, createSignal, splitProps } from "solid-js";
import { createStore } from "solid-js/store";

import { Trans } from "@lingui-solid/solid/macro";
import { styled } from "styled-system/jsx";

import { useError } from "@revolt/i18n";
import { Column, Form, typography } from "@revolt/ui";
import type {
  Action,
  Props as ModalProps,
} from "@revolt/ui/components/design/atoms/display/Modal";
import { getInitialValues } from "@revolt/ui/components/tools/Form";
import type {
  Props as FormProps,
  FormTemplate,
  MapFormToValues,
} from "@revolt/ui/components/tools/Form";

import { modalController } from ".";
import { Modals, PropGenerator } from "./types";

type Props<T extends FormTemplate> = Omit<
  FormProps<T>,
  "onChange" | "store" | "setStore" | "submitBtn" | "onSubmit"
> & {
  /**
   * Form submission callback
   */
  callback: (values: MapFormToValues<T>) => Promise<void>;

  /**
   * Submit button properties
   */
  submit?: Omit<Action, "onClick" | "confirmation">;

  /**
   * Custom actions after submit button
   */
  actions?: Action[];

  /**
   * Props for the modal
   */
  modalProps?: Omit<ModalProps, "disabled" | "actions">;
};

/**
 * Create a modal from form data
 */
export function createFormModal<
  T extends FormTemplate,
  P extends Modals["type"],
>(props: Props<T>): ReturnType<PropGenerator<P>> {
  const [localProps, formProps] = splitProps(props, [
    "callback",
    "submit",
    "actions",
    "modalProps",
  ]);

  const [store, setStore] = createStore(
    getInitialValues(formProps.schema, formProps.defaults),
  );

  const err = useError();
  const [error, setError] = createSignal();
  const [processing, setProcessing] = createSignal(false);

  const onSubmit = async () => {
    try {
      setProcessing(true);
      await localProps.callback(store);
      return true;
    } catch (err) {
      setError(err);
      setProcessing(false);
      return false;
    }
  };

  return {
    ...localProps.modalProps,
    disabled: processing(),
    actions: [
      {
        onClick: onSubmit,
        children: <Trans>Submit</Trans>,
        confirmation: true,
        ...props.submit,
      },
      ...(props.actions ?? [
        {
          onClick: () => true,
          children: <Trans>Cancel</Trans>,
          variant: "plain",
        },
      ]),
    ],
    children: (
      <Column>
        <Form
          {...formProps}
          store={store}
          setStore={setStore}
          onSubmit={async () => {
            if (await onSubmit()) {
              modalController.pop();
            }
          }}
        />
        <Show when={error()}>
          <Error>{err(error())}</Error>
        </Show>
      </Column>
    ),
  };
}

/**
 * Error text
 */
const Error = styled("div", {
  base: {
    color: "var(--customColours-error-color)",

    ...typography.raw({ class: "label", size: "small" }),
  },
});
