import { JSX, Show } from "solid-js";

import { Message, ServerMember, User } from "revolt.js";

import { useClient } from "@revolt/client";
import { getController } from "@revolt/common";

import MdAdminPanelSettings from "@material-design-icons/svg/outlined/admin_panel_settings.svg?component-solid";
import MdBadge from "@material-design-icons/svg/outlined/badge.svg?component-solid";
import MdDoNotDisturbOn from "@material-design-icons/svg/outlined/do_not_disturb_on.svg?component-solid";
import MdFace from "@material-design-icons/svg/outlined/face.svg?component-solid";
import MdPersonRemove from "@material-design-icons/svg/outlined/person_remove.svg?component-solid";
import MdReport from "@material-design-icons/svg/outlined/report.svg?component-solid";

import {
  ContextMenu,
  ContextMenuButton,
  ContextMenuDivider,
} from "./ContextMenu";

/**
 *
 * @param props
 * @returns
 */
export function UserContextMenu(props: {
  user: User;
  member?: ServerMember;
  contextMessage?: Message;
}) {
  // TODO: if we take serverId instead, we could dynamically fetch server member here
  // same for the floating menu I guess?
  const client = useClient();

  /**
   * Edit server identity for user
   */
  function editIdentity() {
    getController("modal").push({
      type: "server_identity",
      member: props.member!,
    });
  }

  /**
   * Report the user
   */
  function reportUser() {
    getController("modal").push({
      type: "report_content",
      target: props.user!,
      client: client(),
      contextMessage: props.contextMessage,
    });
  }

  /**
   * Kick the member
   */
  function kickMember() {
    getController("modal").push({
      type: "kick_member",
      member: props.member!,
    });
  }

  /**
   * Ban the member
   */
  function banMember() {
    getController("modal").push({
      type: "ban_member",
      member: props.member!,
    });
  }

  /**
   * Open user in Revolt Admin Panel
   */
  function openAdminPanel() {
    window.open(
      `https://admin.revolt.chat/panel/inspect/user/${props.user.id}`,
      "_blank"
    );
  }

  /**
   * Copy user id to clipboard
   */
  function copyId() {
    navigator.clipboard.writeText(props.user.id);
  }

  return (
    <ContextMenu>
      <Show
        when={
          props.member &&
          (props.user.self
            ? props.member!.server!.havePermission("ChangeNickname") ||
              props.member!.server!.havePermission("ChangeAvatar")
            : (props.member!.server!.havePermission("ManageNicknames") ||
                props.member!.server!.havePermission("RemoveAvatars")) &&
              props.member!.inferiorTo(props.member!.server!.member!))
        }
      >
        <ContextMenuButton icon={MdFace} onClick={editIdentity}>
          Edit Identity
        </ContextMenuButton>
      </Show>
      <Show when={!props.user.self}>
        <ContextMenuButton icon={MdReport} onClick={reportUser} destructive>
          Report user
        </ContextMenuButton>
      </Show>
      <Show when={props.member}>
        <Show
          when={
            !props.user.self &&
            props.member?.server?.havePermission("KickMembers") &&
            props.member.inferiorTo(props.member.server.member!)
          }
        >
          <ContextMenuButton
            icon={MdPersonRemove}
            onClick={kickMember}
            destructive
          >
            Kick Member
          </ContextMenuButton>
        </Show>
        <Show
          when={
            !props.user.self &&
            props.member?.server?.havePermission("BanMembers") &&
            props.member.inferiorTo(props.member.server.member!)
          }
        >
          <ContextMenuButton
            icon={MdDoNotDisturbOn}
            onClick={banMember}
            destructive
          >
            Ban Member
          </ContextMenuButton>
        </Show>
      </Show>
      <Show when={!props.user.self || props.member}>
        <ContextMenuDivider />
      </Show>
      <ContextMenuButton icon={MdAdminPanelSettings} onClick={openAdminPanel}>
        Admin Panel
      </ContextMenuButton>
      <ContextMenuButton icon={MdBadge} onClick={copyId}>
        Copy user ID
      </ContextMenuButton>
    </ContextMenu>
  );
}

/**
 * Provide floating user menus on this element
 * @param user User
 * @param member Server Member
 */
export function floatingUserMenus(
  user: User,
  member?: ServerMember,
  contextMessage?: Message
): JSX.Directives["floating"] & object {
  return {
    userCard: {
      user,
      member,
      // we could use message to display masquerade info in user card
    },
    /**
     * Build user context menu
     */
    contextMenu() {
      return (
        <UserContextMenu
          user={user}
          member={member}
          contextMessage={contextMessage}
        />
      );
    },
  };
}

export function floatingUserMenusFromMessage(message: Message) {
  return floatingUserMenus(message.author!, message.member, message);
}
