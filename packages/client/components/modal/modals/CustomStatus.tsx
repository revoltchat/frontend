import { Trans } from "@lingui-solid/solid/macro";

import { createFormModal } from "../form";
import { PropGenerator } from "../types";

/**
 * Modal for editing user's custom status
 */
const CustomStatus: PropGenerator<"custom_status"> = (props) => {
  return createFormModal({
    modalProps: {
      title: <Trans>Set your status</Trans>,
    },
    schema: {
      text: "text",
    },
    defaults: {
      text: props.client.user?.status?.text as string,
    },
    data: {
      text: {
        field: <Trans>Custom status</Trans>,
        // -- this is a hack; replace with plain element & panda-css
        "use:autoComplete": true,
      },
    },
    callback: ({ text }) =>
      props.client.user!.edit({
        status: {
          ...props.client.user?.status,
          text: text.trim().length > 0 ? text : undefined,
        },
      }),
    submit: {
      children: <Trans>Save</Trans>,
    },
  });
};

export default CustomStatus;
