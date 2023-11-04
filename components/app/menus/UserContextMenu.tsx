import { JSX, Show } from "solid-js";

import { ServerMember, User } from "revolt.js";

import { ContextMenu, ContextMenuButton } from "./ContextMenu";

/**
 *
 * @param props
 * @returns
 */
export function UserContextMenu(props: { user?: User; member?: ServerMember }) {
  // TODO: if we take serverId instead, we could dynamically fetch server member here
  // same for the floating menu I guess?

  return (
    <ContextMenu>
      user context menu.jpg{" "}
      <Show when={props.member}>
        <ContextMenuButton
          onClick={() => prompt("u sure?") && props.member!.kick()}
        >
          Kick Member
        </ContextMenuButton>
        <ContextMenuButton
          onClick={() =>
            prompt("u sure?") && props.member!.ban({ reason: "die" })
          }
        >
          Ban Member (reason = "die")
        </ContextMenuButton>
      </Show>
      <ContextMenuButton
        onClick={() =>
          window.open(
            `https://admin.revolt.chat/panel/inspect/user/${props.user?.id}`,
            "_blank"
          )
        }
      >
        Admin Panel
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
  member?: ServerMember
): JSX.Directives["floating"] & object {
  return {
    userCard: {
      user,
      member,
    },
    /**
     * Build user context menu
     */
    contextMenu() {
      return <UserContextMenu user={user} member={member} />;
    },
  };
}
