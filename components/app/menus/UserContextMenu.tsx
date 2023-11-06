import { JSX, Show } from "solid-js";

import { ServerMember, User } from "revolt.js";

import { ContextMenu, ContextMenuItem } from "./ContextMenu";

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
      <Show when={props.member}>
        <ContextMenuItem
          onClick={() => prompt("u sure?") && props.member!.kick()}
        >
          Kick Member
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() =>
            prompt("u sure?") && props.member!.ban({ reason: "die" })
          }
        >
          Ban Member (reason = "die")
        </ContextMenuItem>
      </Show>
      <ContextMenuItem
        onClick={() =>
          window.open(
            `https://admin.revolt.chat/panel/inspect/user/${props.user?.id}`,
            "_blank"
          )
        }
      >
        Admin Panel
      </ContextMenuItem>
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
