import { Trans } from "@lingui-solid/solid/macro";

import { createFormModal } from "../form";
import { PropGenerator } from "../types";

/**
 * Modal to delete a message
 */
const DeleteMessage: PropGenerator<"delete_message"> = (props) => {
  return createFormModal({
    modalProps: {
      title: <Trans>Delete message</Trans>,
      description: <Trans>Are you sure you want to delete this?</Trans>,
    },
    schema: {
      message: "custom",
    },
    data: {
      message: {
        // TODO: find a fix or render part of it?
        element: "MESSAGE",
      },
    },
    callback: () => props.message.delete(),
    submit: {
      variant: "error",
      children: <Trans>Delete</Trans>,
    },
  });
};

export default DeleteMessage;
