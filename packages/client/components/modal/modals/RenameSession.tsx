import { Trans, useLingui } from "@lingui-solid/solid/macro";

import { createFormModal } from "../form";
import { PropGenerator } from "../types";

/**
 * Modal for renaming session
 */
const RenameSession: PropGenerator<"rename_session"> = (props) => {
  const { t } = useLingui();

  return createFormModal({
    modalProps: {
      title: <Trans>Rename Session</Trans>,
    },
    schema: {
      name: "text",
    },
    defaults: {
      name: props.session.name,
    },
    data: {
      name: {
        field: <Trans>Name</Trans>,
        placeholder: t`Enter a new name for this session`,
      },
    },
    callback: async ({ name }) => void (await props.session.rename(name)),
    submit: {
      children: <Trans>Rename</Trans>,
    },
  });
};

export default RenameSession;
