import { useTranslation } from "@revolt/i18n";
import { Message } from "@revolt/ui";

import { createFormModal } from "../form";
import { PropGenerator } from "../types";

/**
 * Modal to delete a message
 */
const DeleteMessage: PropGenerator<"delete_message"> = (props) => {
  const t = useTranslation();

  return createFormModal({
    modalProps: {
      title: t("app.context_menu.delete_message"),
      description: t("app.special.modals.prompt.confirm_delete_message_long"),
    },
    schema: {
      message: "custom",
    },
    data: {
      message: {
        element: <Message message={props.message} />,
      },
    },
    callback: () => props.message.delete(),
    submit: {
      palette: "error",
      children: t("app.special.modals.actions.delete"),
    },
  });
};

export default DeleteMessage;
