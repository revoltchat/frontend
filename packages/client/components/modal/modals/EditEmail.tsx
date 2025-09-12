import { createFormControl, createFormGroup } from "solid-forms";

import { Trans, useLingui } from "@lingui-solid/solid/macro";

import { Column, Dialog, DialogProps, Form2 } from "@revolt/ui";

import { useModals } from "..";
import { Modals } from "../types";

/**
 * Change account email address
 */
export function EditEmailModal(
  props: DialogProps & Modals & { type: "edit_email" },
) {
  const { t } = useLingui();
  const { showError } = useModals();

  const group = createFormGroup({
    email: createFormControl("", { required: true }),
    currentPassword: createFormControl("", { required: true }),
  });

  async function onSubmit() {
    try {
      await props.client.account.changeEmail(
        group.controls.email.value,
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
      title={<Trans>Change login email</Trans>}
      actions={[
        { text: <Trans>Close</Trans> },
        {
          text: <Trans>Send email</Trans>,
          onClick: () => {
            onSubmit();
            return false;
          },
          isDisabled: !Form2.canSubmit(group),
        },
      ]}
      isDisabled={group.isPending}
    >
      <form onSubmit={Form2.submitHandler(group, onSubmit)}>
        <Column>
          <Form2.TextField
            name="email"
            type="email"
            label={t`Email`}
            control={group.controls.email}
            placeholder={t`someone@example.com`}
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
