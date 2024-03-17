import { Show } from "solid-js";

import { Message } from "revolt.js";

import { useClient, useUser } from "@revolt/client";
import { getController } from "@revolt/common";
import { state } from "@revolt/state";

import MdBadge from "@material-design-icons/svg/outlined/badge.svg?component-solid";
import MdContentCopy from "@material-design-icons/svg/outlined/content_copy.svg?component-solid";
import MdDelete from "@material-design-icons/svg/outlined/delete.svg?component-solid";
import MdMarkChatUnread from "@material-design-icons/svg/outlined/mark_chat_unread.svg?component-solid";
import MdReply from "@material-design-icons/svg/outlined/reply.svg?component-solid";
import MdReport from "@material-design-icons/svg/outlined/report.svg?component-solid";
import MdShield from "@material-design-icons/svg/outlined/shield.svg?component-solid";

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
export function MessageContextMenu(props: { message: Message }) {
  const user = useUser();
  const client = useClient();

  /**
   * Reply to this message
   */
  function reply() {
    state.draft.addReply(props.message, user()!.id);
  }

  /**
   * Mark message as unread
   */
  function markAsUnread() {
    props.message.ack();
  }

  /**
   * Copy message contents to clipboard
   */
  function copyText() {
    navigator.clipboard.writeText(props.message.content);
  }

  /**
   * Report the message
   */
  function report() {
    getController("modal").push({
      type: "report_content",
      target: props.message,
      client: client(),
    });
  }

  /**
   * Delete the message
   */
  function deleteMessage(ev: MouseEvent) {
    if (ev.shiftKey) {
      props.message.delete();
    } else {
      getController("modal").push({
        type: "delete_message",
        message: props.message,
      });
    }
  }

  /**
   * Open message in Revolt Admin Panel
   */
  function openAdminPanel() {
    window.open(
      `https://admin.revolt.chat/panel/inspect/message/${props.message.id}`,
      "_blank"
    );
  }

  /**
   * Copy message id to clipboard
   */
  function copyId() {
    navigator.clipboard.writeText(props.message.id);
  }

  return (
    <ContextMenu>
      <ContextMenuButton icon={MdReply} onClick={reply}>
        Reply
      </ContextMenuButton>
      <ContextMenuButton icon={MdMarkChatUnread} onClick={markAsUnread}>
        Mark as unread
      </ContextMenuButton>
      <ContextMenuButton icon={MdContentCopy} onClick={copyText}>
        Copy text
      </ContextMenuButton>
      <ContextMenuDivider />
      <Show when={!props.message.author?.self}>
        <ContextMenuButton icon={MdReport} onClick={report} destructive>
          Report message
        </ContextMenuButton>
      </Show>
      <Show
        when={
          props.message.author?.self ||
          props.message.channel?.havePermission("ManageMessages")
        }
      >
        <ContextMenuButton icon={MdDelete} onClick={deleteMessage} destructive>
          Delete message
        </ContextMenuButton>
      </Show>
      <ContextMenuDivider />
      <ContextMenuButton icon={MdShield} onClick={openAdminPanel}>
        Admin Panel
      </ContextMenuButton>
      <ContextMenuButton icon={MdBadge} onClick={copyId}>
        Copy message ID
      </ContextMenuButton>
    </ContextMenu>
  );
}
