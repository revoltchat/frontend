import { Trans } from "@lingui-solid/solid/macro";

import { useError } from "@revolt/i18n";

import { PropGenerator } from "../types";

/**
 * Modal error
 */
const Error: PropGenerator<"error"> = (props) => {
  const err = useError();

  return {
    title: <Trans>An error has occurred!</Trans>,
    children: <span>{err(props.error)}</span>,
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

export default Error;
