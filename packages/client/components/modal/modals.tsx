import { JSX, mergeProps, splitProps } from "solid-js";

import { CONFIGURATION } from "@revolt/common";
import { Modal } from "@revolt/ui";

import { type ActiveModal } from ".";
import add_friend, { AddFriend } from "./modals/AddFriend";
import ban_member from "./modals/BanMember";
import changelog from "./modals/Changelog";
import channel_info from "./modals/ChannelInfo";
import { ChannelToggleMatureModal } from "./modals/ChannelToggleMature";
import create_bot from "./modals/CreateBot";
import create_category from "./modals/CreateCategory";
import create_channel from "./modals/CreateChannel";
import create_group from "./modals/CreateGroup";
import create_invite from "./modals/CreateInvite";
import create_or_join_server from "./modals/CreateOrJoinServer";
import create_role from "./modals/CreateRole";
import create_server from "./modals/CreateServer";
import custom_status from "./modals/CustomStatus";
import delete_bot from "./modals/DeleteBot";
import delete_channel from "./modals/DeleteChannel";
import delete_message from "./modals/DeleteMessage";
import delete_server from "./modals/DeleteServer";
import edit_display_name from "./modals/EditDisplayName";
import edit_email from "./modals/EditEmail";
import edit_keybind from "./modals/EditKeybind";
import edit_password from "./modals/EditPassword";
import edit_username from "./modals/EditUsername";
import error from "./modals/Error";
import { Error2Modal } from "./modals/Error2";
import image_viewer from "./modals/ImageViewer";
import join_server from "./modals/JoinServer";
import kick_member from "./modals/KickMember";
import leave_server from "./modals/LeaveServer";
import mfa_enable_totp from "./modals/MFAEnableTOTP";
import mfa_flow from "./modals/MFAFlow";
import mfa_recovery from "./modals/MFARecovery";
import onboarding from "./modals/Onboarding";
import rename_session from "./modals/RenameSession";
import report_content from "./modals/ReportContent";
import server_identity from "./modals/ServerIdentity";
import server_info from "./modals/ServerInfo";
import settings from "./modals/Settings";
import sign_out_sessions from "./modals/SignOutSessions";
import signed_out from "./modals/SignedOut";
import type { Modals as AllModals, PropGenerator } from "./types";

/**
 * Render the modal
 */
/* eslint-disable solid/reactivity */
/* eslint-disable solid/components-return-once */
export function RenderModal(props: ActiveModal & { onClose: () => void }) {
  if (CONFIGURATION.DEBUG) {
    console.info(
      "components/modal — modal renderer created for type:",
      props.props.type,
    );
  }

  const [modal2Props] = splitProps(props, ["show", "onClose"]);
  const modalProps = mergeProps(props.props, modal2Props);

  switch (modalProps.type) {
    case "add_friend":
      return <AddFriend {...modalProps} />;
    case "channel_toggle_mature":
      return <ChannelToggleMatureModal {...modalProps} />;
    case "error2":
      return <Error2Modal {...modalProps} />;

    default: {
      // legacy behaviour ('modal props')

      // @ts-expect-error unimplemented entries
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Modals: Record<AllModals["type"], PropGenerator<any>> = {
        ban_member,
        changelog,
        channel_info,
        create_bot,
        create_category,
        create_channel,
        create_group,
        create_invite,
        create_role,
        create_server,
        create_or_join_server,
        custom_status,
        delete_bot,
        delete_channel,
        delete_message,
        delete_server,
        edit_display_name,
        edit_email,
        edit_password,
        edit_username,
        error,
        image_viewer,
        join_server,
        edit_keybind,
        kick_member,
        leave_server,
        mfa_enable_totp,
        mfa_flow,
        mfa_recovery,
        onboarding,
        rename_session,
        report_content,
        server_identity,
        server_info,
        settings,
        signed_out,
        sign_out_sessions,
      };

      if (!Modals[props.props.type]) {
        console.error(
          "Failed to create a modal for",
          props.props.type,
          "as it is not registered!",
        );
        console.debug("Modals registered currently:", Modals);
        return null;
      }

      if (CONFIGURATION.DEBUG) {
        console.info("components/modal — ready to render");
      }

      const modalProps = Modals[props.props.type](props.props, props.onClose);

      if (CONFIGURATION.DEBUG) {
        console.info("components/modal — modal props generated", modalProps);
      }

      const Component = (
        modalProps as {
          _children: (props: {
            show: boolean;
            onClose: () => void;
          }) => JSX.Element;
        }
      )._children;

      const element = Component ? (
        <Component show={props.show} onClose={props.onClose} />
      ) : (
        <Modal show={props.show} onClose={props.onClose} {...modalProps} />
      );

      if (CONFIGURATION.DEBUG) {
        console.info("components/modal — created target element:", element);
      }

      return element;
    }
  }
}
