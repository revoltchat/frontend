import { Trans } from "@lingui-solid/solid/macro";
import { useMutation } from "@tanstack/solid-query";

import { Dialog, DialogProps } from "@revolt/ui";

import { useModals } from "..";
import { Modals } from "../types";

/**
 * Modal to delete a bot
 */
export function DeleteBotModal(
  props: DialogProps & Modals & { type: "delete_bot" },
) {
  const { showError } = useModals();

  const deleteBot = useMutation(() => ({
    mutationFn: () => props.bot.delete(),
    onError: showError,
  }));

  return (
    <Dialog
      show={props.show}
      onClose={props.onClose}
      title={<Trans>Delete {props.bot.user!.displayName}?</Trans>}
      actions={[
        { text: <Trans>Cancel</Trans> },
        {
          text: <Trans>Delete</Trans>,
          onClick: () => deleteBot.mutateAsync(),
        },
      ]}
      isDisabled={deleteBot.isPending}
    >
      <Trans>Once it's deleted, there's no going back.</Trans>
    </Dialog>
  );
}
