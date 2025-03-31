import { Trans } from "@lingui-solid/solid/macro";

import { PropGenerator } from "../types";

/**
 * Modal to notify the user they've been signed out
 * TODO: show if user is banned, etc
 */
const SignedOut: PropGenerator<"signed_out"> = () => {
  return {
    title: <Trans>You've been signed out of Revolt!</Trans>,
    actions: [
      {
        children: <Trans>OK</Trans>,
        palette: "secondary",
        onClick() {
          return true;
        },
      },
    ],
  };
};

export default SignedOut;
