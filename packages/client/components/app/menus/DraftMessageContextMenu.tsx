import { Show } from "solid-js";

import { Channel } from "revolt.js";

import { useClient } from "@revolt/client";
import { state } from "@revolt/state";
import { UnsentMessage } from "@revolt/state/stores/Draft";

import MdClose from "@material-design-icons/svg/outlined/close.svg?component-solid";
import MdDelete from "@material-design-icons/svg/outlined/delete.svg?component-solid";
import MdRefresh from "@material-design-icons/svg/outlined/refresh.svg?component-solid";

import { ContextMenu, ContextMenuButton } from "./ContextMenu";

interface Props {
  draft: UnsentMessage;
  channel: Channel;
}

/**
 *
 * @param props
 * @returns
 */
export function DraftMessageContextMenu(props: Props) {
  const client = useClient();

  /**
   * Retry sending the draft message
   */
  function retrySend(ev: MouseEvent) {
    state.draft.retrySend(client(), props.channel, props.draft.idempotencyKey);
  }

  /**
   * Delete the draft message
   */
  function deleteMessage(ev: MouseEvent) {
    state.draft.cancelSend(props.channel, props.draft.idempotencyKey);
  }

  return (
    <Show when={props.draft.status !== "sending"}>
      <ContextMenu>
        <Show when={false}>
          <ContextMenuButton icon={MdClose} onClick={deleteMessage} destructive>
            Cancel send
          </ContextMenuButton>
        </Show>
        <Show
          when={
            props.draft.status === "failed" || props.draft.status === "unsent"
          }
        >
          <ContextMenuButton icon={MdRefresh} onClick={retrySend}>
            Retry send
          </ContextMenuButton>
          <ContextMenuButton
            icon={MdDelete}
            onClick={deleteMessage}
            destructive
          >
            Delete message
          </ContextMenuButton>
        </Show>
      </ContextMenu>
    </Show>
  );
}
