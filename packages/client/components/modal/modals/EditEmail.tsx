import { Trans, useLingui } from "@lingui-solid/solid/macro";

import { createFormModal } from "../form";
import { PropGenerator } from "../types";

/**
 * Modal for editing email
 */
const EditEmail: PropGenerator<"edit_email"> = (props) => {
  const { t } = useLingui();

  return createFormModal({
    modalProps: {
      title: <Trans>Change your email</Trans>,
    },
    schema: {
      email: "text",
      currentPassword: "password",
    },
    data: {
      email: {
        field: <Trans>Email</Trans>,
        placeholder: t`Please enter your email.`,
      },
      currentPassword: {
        field: <Trans>Current Password</Trans>,
        placeholder: t`Enter your current password.`,
      },
    },
    callback: async ({ email, currentPassword }) =>
      void (await props.client.account.changeEmail(email, currentPassword)),
    submit: {
      children: <Trans>Update</Trans>,
    },
  });
};

export default EditEmail;
