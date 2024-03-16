import { useTranslation } from "@revolt/i18n";

import { createFormModal } from "../form";
import { PropGenerator } from "../types";

/**
 * Modal to delete a channel
 */
const DeleteChannel: PropGenerator<"delete_channel"> = (props) => {
  const t = useTranslation();

  return createFormModal({
    modalProps: {
      title: t("app.special.modals.prompt.confirm_delete", {
        name: props.channel.name,
      }),
      description: t("app.special.modals.prompt.confirm_delete_long"),
    },
    schema: {},
    data: {},
    callback: () => props.channel.delete(),
    submit: {
      palette: "error",
      children: t("app.special.modals.actions.delete"),
    },
  });
};

export default DeleteChannel;
