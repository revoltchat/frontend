import { useTranslation } from "@revolt/i18n";

import { createFormModal } from "../form";
import { PropGenerator } from "../types";

/**
 * Modal for editing email
 */
const EditEmail: PropGenerator<"edit_email"> = (props) => {
  const t = useTranslation();

  return createFormModal({
    modalProps: {
      title: t("app.special.modals.account.change.email"),
    },
    schema: {
      email: "text",
      current_password: "password",
    },
    data: {
      email: {
        field: t("login.email"),
        placeholder: t("login.enter.username"),
      },
      current_password: {
        field: t("login.current_password"),
        placeholder: t("login.enter.current_password"),
      },
    },
    callback: async ({ email, current_password }) =>
      void (await props.client.api.patch("/auth/account/change/email", {
        email,
        current_password,
      })),
    submit: {
      children: t("app.special.modals.actions.update"),
    },
  });
};

export default EditEmail;
