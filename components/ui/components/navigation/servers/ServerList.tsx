// ! TODO: #5 implement dnd

import { Server } from "revolt.js/dist/maps/Servers";
import { For, Show } from "solid-js";
import { styled } from "solid-styled-components";
import { Link } from "@revolt/routing";
import { Avatar } from "../../design/atoms/display/Avatar";
import { Unreads, UserStatus } from "../../design/atoms/indicators";
import { InvisibleScrollContainer } from "../../common/ScrollContainers";
import { User } from "revolt.js";

/**
 * Server list container
 */
const ServerListBase = styled(InvisibleScrollContainer)`
  display: flex;
  flex-direction: column;

  background: ${({ theme }) => theme!.colours["background"]};
`;

/**
 * Server entries
 */
const EntryContainer = styled.div`
  width: 52px;
  height: 52px;
  display: grid;
  flex-shrink: 0;
  place-items: center;
`;

interface Props {
  orderedServers: Server[];
  user: User;
}

export const ServerList = ({ orderedServers, user }: Props) => {
  return (
    <ServerListBase>
      <EntryContainer>
        <Link href="/">
          <Avatar
            size={42}
            src={
              user.generateAvatarURL({ max_side: 256 }) ?? user.defaultAvatarURL
            }
            holepunch={"bottom-right"}
            overlay={
              <UserStatus status={user.status?.presence ?? "Invisible"} />
            }
          />
        </Link>
      </EntryContainer>
      <For each={orderedServers}>
        {(item) => (
          <EntryContainer>
            <Link href={`/server/${item._id}`}>
              <Avatar
                size={42}
                src={item.generateIconURL({ max_side: 256 })}
                holepunch={item.isUnread() ? "top-right" : "none"}
                overlay={
                  <>
                    <Show when={item.isUnread()}>
                      <Unreads count={item.getMentions().length} unread />
                    </Show>
                  </>
                }
                fallback={item.name}
              />
            </Link>
          </EntryContainer>
        )}
      </For>
    </ServerListBase>
  );
};
