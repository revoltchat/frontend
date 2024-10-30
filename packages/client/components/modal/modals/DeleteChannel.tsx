import { useTranslation } from "@revolt/i18n";

import { createFormModal } from "../form";
import { PropGenerator } from "../types";

/**
 * Modal to delete a channel
 */
const DeleteChannel: PropGenerator<"delete_channel"> = (props) => {
  const t = useTranslation();
  const i18nKey = `app.special.modals.prompt.${
    props.channel.type === "DirectMessage"
      ? "confirm_close_dm"
      : props.channel.type === "Group"
      ? "confirm_leave"
      : "confirm_delete"
  }`;

  const i18nKeyAction =
    props.channel.type === "DirectMessage"
      ? "close"
      : props.channel.type === "Group"
      ? "leave"
      : "delete";

  return createFormModal({
    modalProps: {
      title: t(i18nKey as any, {
        name: props.channel.name ?? props.channel.recipient?.displayName,
      }),
      description: t((i18nKey + "_long") as any),
    },
    schema: {},
    data: {},
    callback: () => props.channel.delete(),
    submit: {
      variant: "error",
      children: t(`app.special.modals.actions.${i18nKeyAction}`),
    },
  });
};

export default DeleteChannel;
