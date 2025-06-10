import { Show, createSignal, splitProps } from "solid-js";
import { createStore } from "solid-js/store";

import { Trans } from "@lingui-solid/solid/macro";
import { styled } from "styled-system/jsx";

import { useError } from "@revolt/i18n";
import { Column, Form, FormTemplate, typography } from "@revolt/ui";

import { useModals } from ".";
import { Modals, PropGenerator } from "./types";

type Props<T extends FormTemplate> = any;

/**
 * Create a modal from form data
 */
export function createFormModal<
  T extends FormTemplate,
  P extends Modals["type"],
>(props: Props<T>): ReturnType<PropGenerator<P>> {
  const { pop } = useModals();

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
              pop();
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
  },
});
