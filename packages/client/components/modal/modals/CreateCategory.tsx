import { Trans } from "@lingui-solid/solid/macro";
import { ulid } from "ulid";

import { createFormModal } from "../form";
import { PropGenerator } from "../types";

/**
 * Modal to create a new category
 */
const CreateCategory: PropGenerator<"create_category"> = (props) => {
  return createFormModal({
    modalProps: {
      title: <Trans>Create Category</Trans>,
    },
    schema: {
      name: "text",
    },
    data: {
      name: {
        field: <Trans>Channel Name</Trans>,
      },
    },
    callback: ({ name }) =>
      props.server.edit({
        categories: [
          ...(props.server.categories ?? []),
          {
            id: ulid(),
            title: name,
            channels: [],
          },
        ],
      }),
    submit: {
      children: <Trans>Create</Trans>,
    },
  });
};

export default CreateCategory;
