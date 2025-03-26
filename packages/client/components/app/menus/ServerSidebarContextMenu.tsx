import { Show } from "solid-js";

import { Server } from "revolt.js";

import { getController } from "@revolt/common";

import MdLibraryAdd from "@material-design-icons/svg/outlined/library_add.svg?component-solid";

import { ContextMenu, ContextMenuButton } from "./ContextMenu";
import { Trans } from "@lingui-solid/solid/macro";

/**
 * Context menu for server sidebar
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
          <Trans>Create channel</Trans>
        </ContextMenuButton>
      </Show>
    </ContextMenu>
  );
}
