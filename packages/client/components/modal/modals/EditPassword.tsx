import { createFormControl, createFormGroup } from "solid-forms";

import { Trans, useLingui } from "@lingui-solid/solid/macro";

import { Column, Dialog, DialogProps, Form2 } from "@revolt/ui";

import { useModals } from "..";
import { Modals } from "../types";

/**
 * Change account password
 */
export function EditPasswordModal(
  props: DialogProps & Modals & { type: "edit_password" },
) {
  const { t } = useLingui();
  const { showError } = useModals();

  const group = createFormGroup({
    password: createFormControl("", { required: true }),
    currentPassword: createFormControl("", { required: true }),
  });

  async function onSubmit() {
    try {
      await props.client.account.changePassword(
        group.controls.password.value,
        group.controls.currentPassword.value,
      );

      props.onClose();
    } catch (err) {
      showError(err);
    }
  }

  return (
    <Dialog
      show={props.show}
      onClose={props.onClose}
      title={<Trans>Change login password</Trans>}
      actions={[
        { text: <Trans>Close</Trans> },
        {
          text: <Trans>Change</Trans>,
          onClick: () => {
            onSubmit();
            return false;
          },
        },
      ]}
      isDisabled={group.isPending}
    >
      <form onSubmit={Form2.submitHandler(group, onSubmit)}>
        <Column>
          <Form2.TextField
            name="password"
            control={group.controls.password}
            label={t`New Password`}
            type="password"
            placeholder={t`Enter a new password.`}
          />
          <Form2.TextField
            name="currentPassword"
            control={group.controls.currentPassword}
            label={t`Current Password`}
            type="password"
            placeholder={t`Enter your current password...`}
          />
        </Column>
      </form>
    </Dialog>
  );
}
