import { Trans } from "@lingui-solid/solid/macro";
import { useMutation } from "@tanstack/solid-query";

import { Dialog, DialogProps } from "@revolt/ui";

import { useModals } from "..";
import { Modals } from "../types";

/**
 * Modal to sign out of all sessions
 */
export function SignOutSessionsModal(
  props: DialogProps & Modals & { type: "sign_out_sessions" },
) {
  const { showError } = useModals();

  const signOutSessions = useMutation(() => ({
    mutationFn: () => props.client.sessions.deleteAll(),
    onError: showError,
  }));

  return (
    <Dialog
      show={props.show}
      onClose={props.onClose}
      title={<Trans>Are you sure you want to clear your sessions?</Trans>}
      actions={[
        { text: <Trans>Cancel</Trans> },
        {
          text: <Trans>Accept</Trans>,
          onClick: () => signOutSessions.mutateAsync(),
        },
      ]}
      isDisabled={signOutSessions.isPending}
    >
      <Trans>You cannot undo this action.</Trans>
    </Dialog>
  );
}
