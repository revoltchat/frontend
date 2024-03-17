import { Show } from "solid-js";

import { Channel, Server } from "revolt.js";

import { getController } from "@revolt/common";

import MdBadge from "@material-design-icons/svg/outlined/badge.svg?component-solid";
import MdDelete from "@material-design-icons/svg/outlined/delete.svg?component-solid";
import MdLibraryAdd from "@material-design-icons/svg/outlined/library_add.svg?component-solid";
import MdShield from "@material-design-icons/svg/outlined/shield.svg?component-solid";

import { ContextMenu, ContextMenuButton } from "./ContextMenu";

/**
 *
 * @param props
 * @returns
 */
export function ServerSidebarContextMenu(props: { server: Server }) {
  /**
   * Create a new channel
   */
  function createChannel() {
    getController("modal").push({
      type: "create_channel",
      server: props.server!,
    });
  }

  return (
    <ContextMenu>
      <Show when={props.server?.havePermission("ManageChannel")}>
        <ContextMenuButton icon={MdLibraryAdd} onClick={createChannel}>
          Create Channel
        </ContextMenuButton>
      </Show>
    </ContextMenu>
  );
}
