import { Accessor, createMemo } from "solid-js";

import { useClient } from "@revolt/client";
import { useParams } from "@revolt/routing";

// TODO: move to @revolt/common?

/**
 * Resolved user information
 */
interface UserInformation {
  /**
   * Username or nickname
   */
  username: string;

  /**
   * Avatar or server profile avatar
   */
  avatar?: string;

  /**
   * Role colour
   */
  colour?: string | null;
}

/**
 * Resolve multiple users by their ID within the current context
 * @param ids User IDs
 * @param filterNull Filter out null values
 * @returns User information
 */
export function useUsers(
  ids: string[] | Accessor<string[]>,
  filterNull?: boolean
): Accessor<(UserInformation | undefined)[]> {
  const clientAccessor = useClient();

  // TODO: use a context here for when we do multi view :)
  const { server } = useParams<{ server: string }>();

  return createMemo(() => {
    const client = clientAccessor()!;
    const list = (typeof ids === "function" ? ids() : ids).map((id) => {
      const user = client.users.get(id)!;

      if (user) {
        if (server) {
          const member = client.serverMembers.getByKey({
            server,
            user: user._id,
          });
          if (member) {
            return {
              username: member.nickname ?? user.username,
              avatar: member.animatedAvatarURL ?? user.animatedAvatarURL,
              colour: member.roleColour,
            };
          }
        }

        return {
          username: user.username,
          avatar: user.animatedAvatarURL,
        };
      }
    });

    return filterNull ? list.filter((x) => x) : list;
  });
}

export function useUser(id: string): Accessor<UserInformation | undefined> {
  const users = useUsers([id]);
  return () => users()[0];
}
