import { useTranslation } from "@revolt/i18n";

import { createFormModal } from "../form";
import { PropGenerator } from "../types";

const DemoJoinLounge: PropGenerator<"demo"> = (props) => {
  const t = useTranslation();

  return createFormModal({
    modalProps: {
      title: "You are about to join the Revolt server",
      description:
        "Here you will be able to test the client and give feedback.",
    },
    schema: {},
    data: {},
    callback: async () => {
      await props.client.api.post(`/invites/Testers`);
    },
    submit: {
      children: t("app.special.modals.actions.ok"),
    },
  });
};

export default DemoJoinLounge;
