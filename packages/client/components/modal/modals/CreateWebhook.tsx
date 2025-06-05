import { createFormControl, createFormGroup } from "solid-forms";

import { Trans } from "@lingui-solid/solid/macro";
import { t } from "@lingui/core/macro";
import { useMutation } from "@tanstack/solid-query";

import { Form2, Modal2, Modal2Props } from "@revolt/ui";

import { useModals } from "..";
import { Modals } from "../types";

/**
 * Create a new group and optionally add members
 */
export function CreateWebhookModal(
  props: Modal2Props & Modals & { type: "create_webhook" },
) {
  const { openModal } = useModals();

  const group = createFormGroup({
    name: createFormControl(""),
  });

  const change = useMutation(() => ({
    mutationFn: (name: string) => props.channel.createWebhook(name),
    onSuccess: (webhook) => props.callback(webhook.id),
    onError: (error) => openModal({ type: "error2", error }),
  }));

  async function onSubmit() {
    await change.mutateAsync(group.controls.name.value);

    props.onClose();
  }

  return (
    <Modal2
      minWidth={420}
      show={props.show}
      onClose={props.onClose}
      title={<Trans>Create a webhook</Trans>}
      actions={[
        { text: <Trans>Close</Trans> },
        {
          text: <Trans>Create</Trans>,
          onClick: () => {
            onSubmit();
            return false;
          },
        },
      ]}
      isDisabled={change.isPending}
    >
      <form onSubmit={Form2.submitHandler(group, onSubmit)}>
        <Form2.TextField
          name="name"
          control={group.controls.name}
          label={t`Webhook Name`}
        />
      </form>
    </Modal2>
  );
}
