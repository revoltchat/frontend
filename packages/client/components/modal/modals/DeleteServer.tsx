import { useTranslation } from "@revolt/i18n";

import { createFormModal } from "../form";
import { PropGenerator } from "../types";

/**
 * Modal to delete a server
 */
const DeleteServer: PropGenerator<"delete_server"> = (props) => {
  const t = useTranslation();

  return createFormModal({
    modalProps: {
      title: t("app.special.modals.prompt.confirm_delete", {
        name: props.server.name,
      }),
      description: t("app.special.modals.prompt.confirm_delete_long"),
    },
    schema: {},
    data: {},
    callback: () => props.server.delete(), // TODO: need mfa flow to confirm
    submit: {
      palette: "error",
      children: t("app.special.modals.actions.delete"),
    },
  });
};

export default DeleteServer;
