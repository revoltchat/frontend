import { createFormControl, createFormGroup } from "solid-forms";

import { Trans } from "@lingui-solid/solid/macro";

import { Avatar, Column, Dialog, DialogProps, Text } from "@revolt/ui";

import { useModals } from "..";
import { Modals } from "../types";

/**
 * Kick a server member
 */
export function KickMemberModal(
  props: DialogProps & Modals & { type: "kick_member" },
) {
  const { showError } = useModals();

  const group = createFormGroup({
    reason: createFormControl(""),
  });

  async function onSubmit() {
    try {
      await props.member.kick();
      props.onClose();
    } catch (error) {
      showError(error);
    }
  }

  return (
    <Dialog
      show={props.show}
      onClose={props.onClose}
      title={<Trans>Kick Member</Trans>}
      actions={[
        { text: <Trans>Cancel</Trans> },
        {
          text: <Trans>Kick</Trans>,
          onClick: () => {
            onSubmit();
            return false;
          },
        },
      ]}
      isDisabled={group.isPending}
    >
      <Column align>
        <Avatar src={props.member.user?.animatedAvatarURL} size={64} />
        <Text>
          <Trans>You are about to kick {props.member.user?.username}</Trans>
        </Text>
      </Column>
    </Dialog>
  );
}
