import { Message } from "revolt.js";

import { useUser } from "@revolt/client";
import { state } from "@revolt/state";

import { ContextMenu, ContextMenuButton } from "./ContextMenu";

/**
 *
 * @param props
 * @returns
 */
export function MessageContextMenu(props: { message: Message }) {
  const user = useUser();

  return (
    <ContextMenu>
      my context menu.jpg{" "}
      <ContextMenuButton
        onClick={() => {
          state.draft.addReply(props.message, user()!.id);
        }}
      >
        Reply
      </ContextMenuButton>
      <ContextMenuButton>Mark as unread</ContextMenuButton>
      <ContextMenuButton
        onClick={() => {
          navigator.clipboard.writeText(props.message.content);
        }}
      >
        Copy text
      </ContextMenuButton>
      <ContextMenuButton>Report message</ContextMenuButton>
      <ContextMenuButton
        onClick={() => {
          props.message.delete();
        }}
      >
        Delete message
      </ContextMenuButton>
      <ContextMenuButton
        onClick={() =>
          window.open(
            `https://admin.revolt.chat/panel/inspect/message/${props.message.id}`,
            "_blank"
          )
        }
      >
        Admin Panel
      </ContextMenuButton>
    </ContextMenu>
  );
}
