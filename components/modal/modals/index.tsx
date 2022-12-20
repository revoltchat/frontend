import { Modal } from "@revolt/ui";
import { ActiveModal, modalController } from "..";
import type { Modals as AllModals, PropGenerator } from "../types";

import clipboard from "./Clipboard";
import mfa_enable_totp from "./MFAEnableTOTP";

const Modals: Record<AllModals["type"], PropGenerator<any>> = {
  clipboard,
  mfa_enable_totp,
  ...({} as any),
};

export function RenderModal(props: ActiveModal) {
  const onClose = () => modalController.remove(props.id);
  const modalProps = Modals[props.props.type](props.props, onClose);
  return <Modal show={props.show} onClose={onClose} {...modalProps} />;
}
