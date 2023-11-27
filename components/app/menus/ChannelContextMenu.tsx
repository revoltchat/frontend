import { Show } from "solid-js";

import { Channel } from "revolt.js";

import { getController } from "@revolt/common";

import MdBadge from "@material-design-icons/svg/outlined/badge.svg?component-solid";
import MdDelete from "@material-design-icons/svg/outlined/delete.svg?component-solid";
import MdLibraryAdd from "@material-design-icons/svg/outlined/library_add.svg?component-solid";
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
export function ChannelContextMenu(props: { channel: Channel }) {
  /**
   * Create a new channel
   */
  function createChannel() {
    getController("modal").push({
      type: "create_channel",
      server: props.channel.server!,
    });
  }

  /**
   * Delete channel
   */
  function deleteChannel() {
    getController("modal").push({
      type: "delete_channel",
      channel: props.channel,
    });
  }

  /**
   * Open channel in Revolt Admin Panel
   */
  function openAdminPanel() {
    window.open(
      `https://admin.revolt.chat/panel/inspect/channel/${props.channel.id}`,
      "_blank"
    );
  }

  /**
   * Copy channel id to clipboard
   */
  function copyId() {
    navigator.clipboard.writeText(props.channel.id);
  }

  return (
    <ContextMenu>
      <Show when={props.channel.server?.havePermission("ManageChannel")}>
        {/* TODO re order */}
        <ContextMenuButton icon={MdLibraryAdd} onClick={createChannel}>
          Create Channel
        </ContextMenuButton>
      </Show>
      <Show when={props.channel.havePermission("ManageChannel")}>
        <ContextMenuButton icon={MdDelete} onClick={deleteChannel} destructive>
          Delete Channel
        </ContextMenuButton>
        <ContextMenuDivider />
      </Show>
      <ContextMenuButton icon={MdShield} onClick={openAdminPanel}>
        Admin Panel
      </ContextMenuButton>
      <ContextMenuButton icon={MdBadge} onClick={copyId}>
        Copy channel ID
      </ContextMenuButton>
    </ContextMenu>
  );
}
