import { useTranslation } from "@revolt/i18n";

import { createFormModal } from "../form";
import { PropGenerator } from "../types";

/**
 * Modal to leave a server
 */
const LeaveServer: PropGenerator<"leave_server"> = (props) => {
  const t = useTranslation();

  return createFormModal({
    modalProps: {
      title: t("app.special.modals.prompt.confirm_leave", {
        name: props.server.name,
      }),
      description: t("app.special.modals.prompt.confirm_leave_long"),
    },
    schema: {},
    data: {},
    callback: () => props.server.delete(),
    submit: {
      palette: "error",
      children: t("app.special.modals.actions.leave"),
    },
  });
};

export default LeaveServer;
