import { Trans, useLingui } from "@lingui-solid/solid/macro";

import { createFormModal } from "../form";
import { PropGenerator } from "../types";

/**
 * Modal for editing display name
 */
const EditDisplayName: PropGenerator<"edit_display_name"> = (props) => {
  const { t } = useLingui();

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
      title: <Trans>Change your display name</Trans>,
    },
    schema: {
      display_name: "text",
    },
    data: {
      display_name: {
        field: <Trans>Display Name</Trans>,
        placeholder: t`Choose a display name`,
      },
    },
    callback: ({ display_name }) => applyName(display_name),
    submit: {
      children: <Trans>Change</Trans>,
    },
    actions: [
      {
        type: "button",
        variant: "plain",
        children: <Trans>Clear</Trans>,
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
