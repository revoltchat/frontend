import { Modal } from "@revolt/ui";
import { ActiveModal, modalController } from "..";
import type { Modals as AllModals, PropGenerator } from "../types";

import add_friend from "./AddFriend";
import ban_member from "./BanMember";
import changelog from "./Changelog";
import clipboard from "./Clipboard";
import create_bot from "./CreateBot";
import create_category from "./CreateCategory";
import create_channel from "./CreateChannel";
import create_group from "./CreateGroup";
import create_invite from "./CreateInvite";
import create_role from "./CreateRole";
import create_server from "./CreateServer";
import delete_message from "./DeleteMessage";
import kick_member from "./KickMember";
import mfa_enable_totp from "./MFAEnableTOTP";
import mfa_flow from "./MFAFlow";
import mfa_recovery from "./MFARecovery";

const Modals: Record<AllModals["type"], PropGenerator<any>> = {
  add_friend,
  ban_member,
  changelog,
  clipboard,
  create_bot,
  create_category,
  create_channel,
  create_group,
  create_invite,
  create_role,
  create_server,
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
