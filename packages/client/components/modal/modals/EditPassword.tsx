import { Trans, useLingui } from "@lingui-solid/solid/macro";

import { createFormModal } from "../form";
import { PropGenerator } from "../types";

/**
 * Modal for editing password
 */
const EditPassword: PropGenerator<"edit_password"> = (props) => {
  const { t } = useLingui();

  return createFormModal({
    modalProps: {
      title: <Trans>Change your password</Trans>,
    },
    schema: {
      password: "password",
      currentPassword: "password",
    },
    data: {
      password: {
        field: <Trans>Password</Trans>,
        placeholder: t`Enter a new password.`,
      },
      currentPassword: {
        field: <Trans>Current Password</Trans>,
        placeholder: t`Enter your current password.`,
      },
    },
    callback: async ({ password, currentPassword }) =>
      void (await props.client.account.changePassword(
        password,
        currentPassword,
      )),
    submit: {
      children: <Trans>Update</Trans>,
    },
  });
};

export default EditPassword;
