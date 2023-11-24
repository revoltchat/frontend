import { Message } from "revolt.js";

import { useUser } from "@revolt/client";
import { getController } from "@revolt/common";
import { state } from "@revolt/state";

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

  return (
    <ContextMenu>
      <ContextMenuButton
        icon={MdReply}
        onClick={() => {
          state.draft.addReply(props.message, user()!.id);
        }}
      >
        Reply
      </ContextMenuButton>
      <ContextMenuButton icon={MdMarkChatUnread}>
        Mark as unread
      </ContextMenuButton>
      <ContextMenuButton
        icon={MdContentCopy}
        onClick={() => {
          navigator.clipboard.writeText(props.message.content);
        }}
      >
        Copy text
      </ContextMenuButton>
      <ContextMenuDivider />
      <ContextMenuButton
        icon={MdReport}
        onClick={() => {
          getController("modal").push({
            type: "report_content",
            target: props.message,
          });
        }}
      >
        Report message
      </ContextMenuButton>
      <ContextMenuButton
        icon={MdDelete}
        onClick={() => {
          props.message.delete();
        }}
      >
        Delete message
      </ContextMenuButton>
      <ContextMenuButton
        icon={MdShield}
        onClick={() =>
          window.open(
            `https://admin.revolt.chat/panel/inspect/message/${props.message.id}`,
            "_blank"
          )
        }
      >
        Open as admin
      </ContextMenuButton>
    </ContextMenu>
  );
}
