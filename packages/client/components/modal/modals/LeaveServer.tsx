import { Trans } from "@lingui-solid/solid/macro";

import { createFormModal } from "../form";
import { PropGenerator } from "../types";

/**
 * Modal to leave a server
 */
const LeaveServer: PropGenerator<"leave_server"> = (props) => {
  return createFormModal({
    modalProps: {
      title: <Trans>Leave {props.server.name}?</Trans>,
      description: (
        <Trans>You won't be able to rejoin unless you are re-invited.</Trans>
      ),
    },
    schema: {
      silent: "checkbox",
    },
    data: {
      silent: {
        title: <Trans>Leave silently</Trans>,
        description: (
          <Trans>Other members will not be notified that you left.</Trans>
        ),
      },
    },
    callback: (data) => props.server.delete(data.silent),
    submit: {
      variant: "error",
      children: <Trans>Leave</Trans>,
    },
  });
};

export default LeaveServer;
