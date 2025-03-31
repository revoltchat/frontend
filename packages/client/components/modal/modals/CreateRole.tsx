import { Trans } from "@lingui-solid/solid/macro";

import { createFormModal } from "../form";
import { PropGenerator } from "../types";

/**
 * Modal to create a new server role
 */
const CreateInvite: PropGenerator<"create_role"> = (props) => {
  return createFormModal({
    modalProps: {
      title: <Trans>Create Role</Trans>,
    },
    schema: {
      name: "text",
    },
    data: {
      name: {
        field: <Trans>Role Name</Trans>,
      },
    },
    callback: async ({ name }) => {
      const role = await props.server.createRole(name);
      props.callback(role.id);
    },
    submit: {
      children: <Trans>Create</Trans>,
    },
  });
};

export default CreateInvite;
