import { useTranslation } from "@revolt/i18n";

import { createFormModal } from "../form";
import { PropGenerator } from "../types";

/**
 * Modal for editing password
 */
const EditPassword: PropGenerator<"edit_password"> = (props) => {
  const t = useTranslation();

  return createFormModal({
    modalProps: {
      title: t("app.special.modals.account.change.password"),
    },
    schema: {
      password: "password",
      current_password: "password",
    },
    data: {
      password: {
        field: t("login.password"),
        placeholder: t("login.enter.password"),
      },
      current_password: {
        field: t("login.current_password"),
        placeholder: t("login.enter.current_password"),
      },
    },
    callback: async ({ password, current_password }) =>
      void (await props.client.api.patch("/auth/account/change/password", {
        password,
        current_password,
      })),
    submit: {
      children: t("app.special.modals.actions.update"),
    },
  });
};

export default EditPassword;
