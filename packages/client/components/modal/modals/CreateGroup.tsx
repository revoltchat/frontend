import { Trans } from "@lingui-solid/solid/macro";

import { useNavigate } from "@revolt/routing";

import { createFormModal } from "../form";
import { PropGenerator } from "../types";

/**
 * Modal to create a new group channel
 */
const CreateGroup: PropGenerator<"create_group"> = (props) => {
  const navigate = useNavigate();

  return createFormModal({
    modalProps: {
      title: <Trans>Create Group</Trans>,
    },
    schema: {
      name: "text",
    },
    data: {
      name: {
        field: <Trans>Group Name</Trans>,
      },
    },
    callback: async ({ name }) => {
      const group = await props.client.channels.createGroup(name, []);

      navigate(`/channel/${group.id}`);
    },
    submit: {
      children: <Trans>Create</Trans>,
    },
  });
};

export default CreateGroup;
