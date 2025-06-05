import { Match, Show, Switch } from "solid-js";

import { Trans } from "@lingui-solid/solid/macro";
import { Message } from "revolt.js";

import { useClient, useUser } from "@revolt/client";
import { useModals } from "@revolt/modal";
import { useState } from "@revolt/state";

import MdBadge from "@material-design-icons/svg/outlined/badge.svg?component-solid";
import MdContentCopy from "@material-design-icons/svg/outlined/content_copy.svg?component-solid";
import MdDelete from "@material-design-icons/svg/outlined/delete.svg?component-solid";
import MdEdit from "@material-design-icons/svg/outlined/edit.svg?component-solid";
import MdMarkChatUnread from "@material-design-icons/svg/outlined/mark_chat_unread.svg?component-solid";
import MdPin from "@material-design-icons/svg/outlined/pin_invoke.svg?component-solid";
import MdReply from "@material-design-icons/svg/outlined/reply.svg?component-solid";
import MdReport from "@material-design-icons/svg/outlined/report.svg?component-solid";
import MdShare from "@material-design-icons/svg/outlined/share.svg?component-solid";
import MdShield from "@material-design-icons/svg/outlined/shield.svg?component-solid";

import {
  ContextMenu,
  ContextMenuButton,
  ContextMenuDivider,
} from "./ContextMenu";

/**
 * Context menu for messages
 */
export function MessageContextMenu(props: { message: Message }) {
  const user = useUser();
  const state = useState();
  const client = useClient();
  const { openModal, showError } = useModals();

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
    openModal({
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
      openModal({
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
      "_blank",
    );
  }

  /**
   * Copy message link to clipboard
   */
  function copyLink() {
    navigator.clipboard.writeText(
      `${location.origin}${
        props.message.server ? `/server/${props.message.server?.id}` : ""
      }/channel/${props.message.channelId}/${props.message.id}`,
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
        <Trans>Reply</Trans>
      </ContextMenuButton>
      <ContextMenuButton icon={MdMarkChatUnread} onClick={markAsUnread}>
        <Trans>Mark as unread</Trans>
      </ContextMenuButton>
      <ContextMenuButton icon={MdContentCopy} onClick={copyText}>
        <Trans>Copy text</Trans>
      </ContextMenuButton>
      <ContextMenuDivider />
      <Show
        when={
          props.message.author?.self &&
          props.message.channel?.havePermission("SendMessage")
        }
      >
        <ContextMenuButton
          icon={MdEdit}
          onClick={() => state.draft.setEditingMessage(props.message)}
        >
          <Trans>Edit message</Trans>
        </ContextMenuButton>
      </Show>
      <Show
        when={
          props.message.author?.self ||
          props.message.channel?.havePermission("ManageMessages")
        }
      >
        <ContextMenuButton
          icon={MdPin}
          onClick={() => {
            if (props.message.pinned) {
              props.message.unpin().catch(showError);
            } else {
              props.message.pin().catch(showError);
            }
          }}
        >
          <Switch fallback={<Trans>Pin message</Trans>}>
            <Match when={props.message.pinned}>
              <Trans>Unpin message</Trans>
            </Match>
          </Switch>
        </ContextMenuButton>
      </Show>
      <Show
        when={
          props.message.author?.self ||
          props.message.channel?.havePermission("ManageMessages")
        }
      >
        <ContextMenuButton icon={MdDelete} onClick={deleteMessage} destructive>
          <Trans>Delete message</Trans>
        </ContextMenuButton>
      </Show>
      <Show when={!props.message.author?.self}>
        <ContextMenuButton icon={MdReport} onClick={report} destructive>
          <Trans>Report message</Trans>
        </ContextMenuButton>
      </Show>
      <ContextMenuDivider />
      <ContextMenuButton icon={MdShield} onClick={openAdminPanel}>
        <Trans>Admin Panel</Trans>
      </ContextMenuButton>
      <ContextMenuButton icon={MdShare} onClick={copyLink}>
        <Trans>Copy link</Trans>
      </ContextMenuButton>
      <ContextMenuButton icon={MdBadge} onClick={copyId}>
        <Trans>Copy message ID</Trans>
      </ContextMenuButton>
    </ContextMenu>
  );
}
