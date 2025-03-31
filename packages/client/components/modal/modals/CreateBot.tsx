import { Trans } from "@lingui-solid/solid/macro";

import { createFormModal } from "../form";
import { PropGenerator } from "../types";

/**
 * Modal to create a new bot
 */
const CreateBot: PropGenerator<"create_bot"> = (props) => {
  return createFormModal({
    modalProps: {
      title: <Trans>Create Bot</Trans>,
    },
    schema: {
      name: "text",
    },
    data: {
      name: {
        field: <Trans>Username</Trans>,
      },
    },
    callback: async ({ name }) => {
      const bot = await props.client.bots.createBot(name);
      props.onCreate(bot);
    },
    submit: {
      children: <Trans>Create</Trans>,
    },
  });
};

export default CreateBot;
