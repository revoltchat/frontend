import { Trans } from "@lingui-solid/solid/macro";

import { useError } from "@revolt/i18n";
import { Modal2, Modal2Props, iconSize } from "@revolt/ui";

import MdError from "@material-design-icons/svg/outlined/error.svg?component-solid";

import { Modals } from "../types";

export function Error2Modal(props: Modal2Props & Modals & { type: "error2" }) {
  const err = useError();

  return (
    <Modal2
      icon={<MdError {...iconSize(24)} />}
      show={props.show}
      onClose={props.onClose}
      title={<Trans>An error occurred.</Trans>}
      actions={[{ text: <Trans>OK</Trans> }]}
    >
      {err(props.error)}
    </Modal2>
  );
}
