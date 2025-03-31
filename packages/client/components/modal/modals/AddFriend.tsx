import { Trans } from "@lingui-solid/solid/macro";

import { createFormModal } from "../form";
import { PropGenerator } from "../types";

/**
 * Modal for adding another user as a friend
 */
const AddFriend: PropGenerator<"add_friend"> = (props) => {
  return createFormModal({
    modalProps: {
      title: <Trans>Add Friend</Trans>,
    },
    schema: {
      username: "text",
    },
    data: {
      username: {
        field: "Username",
      },
    },
    callback: async ({ username }) =>
      void (await props.client.api.post(`/users/friend`, { username })),
    submit: {
      children: <Trans>Send request</Trans>,
    },
  });
};

export default AddFriend;
