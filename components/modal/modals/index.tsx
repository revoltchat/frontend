import { Modal } from "@revolt/ui";

import { ActiveModal, modalController } from "..";
import type { Modals as AllModals, PropGenerator } from "../types";

import add_friend from "./AddFriend";
import ban_member from "./BanMember";
import changelog from "./Changelog";
import channel_info from "./ChannelInfo";
import clipboard from "./Clipboard";
import create_bot from "./CreateBot";
import create_category from "./CreateCategory";
import create_channel from "./CreateChannel";
import create_group from "./CreateGroup";
import create_invite from "./CreateInvite";
import create_role from "./CreateRole";
import create_server from "./CreateServer";
import custom_status from "./CustomStatus";
import delete_message from "./DeleteMessage";
import kick_member from "./KickMember";
import mfa_enable_totp from "./MFAEnableTOTP";
import mfa_flow from "./MFAFlow";
import mfa_recovery from "./MFARecovery";
import onboarding from "./Onboarding";
import server_info from "./ServerInfo";

const Modals: Record<AllModals["type"], PropGenerator<any>> = {
  add_friend,
  ban_member,
  changelog,
  channel_info,
  clipboard,
  create_bot,
  create_category,
  create_channel,
  create_group,
  create_invite,
  create_role,
  create_server,
  custom_status,
  delete_message,
  kick_member,
  mfa_enable_totp,
  mfa_flow,
  mfa_recovery,
  onboarding,
  server_info,
  ...({} as any),
};

export function RenderModal(props: ActiveModal) {
  const onClose = () => modalController.remove(props.id);
  const modalProps = Modals[props.props.type](props.props, onClose);
  return <Modal show={props.show} onClose={onClose} {...modalProps} />;
}
