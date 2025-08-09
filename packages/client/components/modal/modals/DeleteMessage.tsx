import { Trans } from "@lingui-solid/solid/macro";
import { useMutation } from "@tanstack/solid-query";

import { Dialog, DialogProps } from "@revolt/ui";

import { useModals } from "..";
import { Modals } from "../types";

/**
 * Modal to delete a message
 */
export function DeleteMessageModal(
  props: DialogProps & Modals & { type: "delete_message" },
) {
  const { showError } = useModals();

  const deleteMessage = useMutation(() => ({
    mutationFn: () => props.message.delete(),
    onError: showError,
  }));

  return (
    <Dialog
      show={props.show}
      onClose={props.onClose}
      title={<Trans>Delete message</Trans>}
      actions={[
        { text: <Trans>Cancel</Trans> },
        {
          text: <Trans>Delete</Trans>,
          onClick: () => deleteMessage.mutateAsync(),
        },
      ]}
      isDisabled={deleteMessage.isPending}
    >
      <Trans>Are you sure you want to delete this?</Trans>
    </Dialog>
  );
}
