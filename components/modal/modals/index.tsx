import { Modal } from "@revolt/ui";
import { ActiveModal, modalController } from "..";
import type { Modals as AllModals, PropGenerator } from "../types";

import add_friend from "./AddFriend";
import ban_member from "./BanMember";
import clipboard from "./Clipboard";
import delete_message from "./DeleteMessage";
import kick_member from "./KickMember";
import mfa_enable_totp from "./MFAEnableTOTP";
import mfa_flow from "./MFAFlow";
import mfa_recovery from "./MFARecovery";

const Modals: Record<AllModals["type"], PropGenerator<any>> = {
  add_friend,
  ban_member,
  clipboard,
  delete_message,
  kick_member,
  mfa_enable_totp,
  mfa_flow,
  mfa_recovery,
  ...({} as any),
};

export function RenderModal(props: ActiveModal) {
  const onClose = () => modalController.remove(props.id);
  const modalProps = Modals[props.props.type](props.props, onClose);
  return <Modal show={props.show} onClose={onClose} {...modalProps} />;
}
