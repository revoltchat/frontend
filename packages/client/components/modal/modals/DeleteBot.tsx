import { Trans } from "@lingui-solid/solid/macro";

import { createFormModal } from "../form";
import { PropGenerator } from "../types";

/**
 * Modal to delete a bot
 */
const DeleteBot: PropGenerator<"delete_bot"> = (props) => {
  return createFormModal({
    modalProps: {
      title: <Trans>Delete {props.bot.user!.displayName}?</Trans>,
      description: <Trans>Once it's deleted, there's no going back.</Trans>,
    },
    schema: {},
    data: {},
    callback: () => props.bot.delete(),
    submit: {
      variant: "error",
      children: <Trans>Delete</Trans>,
    },
  });
};

export default DeleteBot;
