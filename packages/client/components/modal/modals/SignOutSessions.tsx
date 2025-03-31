import { Trans } from "@lingui-solid/solid/macro";

import { PropGenerator } from "../types";

/**
 * Modal to display server information
 */
const SignOutSessions: PropGenerator<"sign_out_sessions"> = (props) => {
  /**
   * Confirm session sign out
   */
  const confirm = () => props.client.sessions.deleteAll().then(() => true);

  return {
    title: <Trans>Are you sure you want to clear your sessions?</Trans>,
    children: <Trans>You cannot undo this action.</Trans>,
    actions: [
      {
        palette: "accent",
        onClick: () => true,
        children: <Trans>Cancel</Trans>,
      },
      {
        onClick: confirm,
        children: <Trans>Accept</Trans>,
      },
    ],
  };
};

export default SignOutSessions;
