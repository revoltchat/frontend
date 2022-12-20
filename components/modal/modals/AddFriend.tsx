import { useTranslation } from "@revolt/i18n";
import { createFormModal } from "../form";
import { ModalProps, PropGenerator } from "../types";

/**
 * Modal to display some text which could not be written to the browser clipboard
 */
const AddFriend: PropGenerator<"add_friend"> = (
  props: ModalProps<"add_friend">
) => {
  const t = useTranslation();

  return createFormModal({
    modalProps: {
      title: t("app.context_menu.add_friend"),
    },
    schema: {
      username: "text",
    },
    data: {
      username: {
        field: "Username",
      },
    },
    callback: async ({ username }) =>
      void (await props.client.api.post(`/users/friend`, { username })),
    submit: {
      children: t("app.special.modals.actions.ok"),
    },
  });
};

export default AddFriend;
