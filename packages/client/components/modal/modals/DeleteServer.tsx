import { Trans } from "@lingui-solid/solid/macro";

import { useClient } from "@revolt/client";

import { useModals } from "..";
import { createFormModal } from "../form";
import { PropGenerator } from "../types";

/**
 * Modal to delete a server
 */
const DeleteServer: PropGenerator<"delete_server"> = (props) => {
  const client = useClient();
  const { mfaFlow } = useModals();

  return createFormModal({
    modalProps: {
      title: <Trans>Delete {props.server.name}?</Trans>,
      description: <Trans>Once it's deleted, there's no going back.</Trans>,
    },
    schema: {},
    data: {},
    callback: async () => {
      const mfa = await client().account.mfa();
      await mfaFlow(mfa as never);
      await props.server.delete(); // TODO: should use ticket in API
    },
    submit: {
      variant: "error",
      children: <Trans>Delete</Trans>,
    },
  });
};

export default DeleteServer;
