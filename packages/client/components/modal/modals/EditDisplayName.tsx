import { useTranslation } from "@revolt/i18n";

import { createFormModal } from "../form";
import { PropGenerator } from "../types";

/**
 * Modal for editing display name
 */
const EditDisplayName: PropGenerator<"edit_display_name"> = (props) => {
  const t = useTranslation();

  /**
   * Apply new display name
   * @param display_name Display name
   */
  async function applyName(display_name?: string) {
    if (display_name && display_name !== props.user.username) {
      await props.user.edit({ display_name });
    } else {
      await props.user.edit({
        remove: ["DisplayName"],
      });
    }
  }

  return createFormModal({
    modalProps: {
      title: t("app.special.modals.account.change.display_name"),
    },
    schema: {
      display_name: "text",
    },
    data: {
      display_name: {
        field: "Display Name",
        placeholder: "Choose a display name",
      },
    },
    callback: ({ display_name }) => applyName(display_name),
    submit: {
      children: t("app.special.modals.actions.update"),
    },
    actions: [
      {
        type: "button",
        variant: "plain",
        children: "Clear",
        /**
         * Clear display name
         */
        async onClick() {
          await applyName();
          return true;
        },
      },
    ],
  });
};

export default EditDisplayName;
