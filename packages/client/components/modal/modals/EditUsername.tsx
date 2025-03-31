import { Trans, useLingui } from "@lingui-solid/solid/macro";

import { createFormModal } from "../form";
import { PropGenerator } from "../types";

/**
 * Modal for editing username
 */
const EditUsername: PropGenerator<"edit_username"> = (props) => {
  const { t } = useLingui();

  return createFormModal({
    modalProps: {
      title: <Trans>Change your username</Trans>,
    },
    schema: {
      username: "text",
      password: "password",
    },
    data: {
      username: {
        field: "Username",
        placeholder: t`Enter your preferred username.`,
      },
      password: {
        field: "Current Password",
        placeholder: t`Enter your current password.`,
      },
    },
    callback: async ({ username, password }) =>
      void (await props.client.user!.changeUsername(username, password)),
    submit: {
      children: <Trans>Change</Trans>,
    },
  });
};

export default EditUsername;
