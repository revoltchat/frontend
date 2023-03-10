import { useTranslation } from "@revolt/i18n";

import { createFormModal } from "../form";
import { PropGenerator } from "../types";

/**
 * Modal for editing user's custom status
 */
const CustomStatus: PropGenerator<"custom_status"> = (props) => {
  const t = useTranslation();

  return createFormModal({
    modalProps: {
      title: t("app.context_menu.set_custom_status"),
    },
    schema: {
      text: "text",
    },
    defaults: {
      text: props.client.user?.status?.text as string,
    },
    data: {
      text: {
        field: t("app.context_menu.custom_status"),
      },
    },
    callback: ({ text }) =>
      props.client.users.edit({
        status: {
          ...props.client.user?.status,
          text: text.trim().length > 0 ? text : undefined,
        },
      }),
    submit: {
      children: t("app.special.modals.actions.save"),
    },
  });
};

export default CustomStatus;
