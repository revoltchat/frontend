import { Show } from "solid-js";

import { Trans } from "@lingui-solid/solid/macro";
import { Server } from "revolt.js";

import { useModals } from "@revolt/modal";

import MdLibraryAdd from "@material-design-icons/svg/outlined/library_add.svg?component-solid";

import { ContextMenu, ContextMenuButton } from "./ContextMenu";

/**
 * Context menu for server sidebar
 */
export function ServerSidebarContextMenu(props: { server: Server }) {
  const { openModal } = useModals();

  /**
   * Create a new channel
   */
  function createChannel() {
    openModal({
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
