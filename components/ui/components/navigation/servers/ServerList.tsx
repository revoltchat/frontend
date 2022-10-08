// ! TODO: #5 implement dnd

import { Server } from "revolt.js/dist/maps/Servers";
import { For, Show } from "solid-js";
import { styled } from "solid-styled-components";
import { Link } from "@revolt/routing";
import { Avatar } from "../../design/atoms/display/Avatar";
import { Unreads } from "../../design/atoms/indicators";
import { BiRegularHome } from "solid-icons/bi";
import { InvisibleScrollContainer } from "../../common/ScrollContainers";

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
  width: 50px;
  height: 50px;
  display: grid;
  flex-shrink: 0;
  place-items: center;
`;

interface Props {
  orderedServers: Server[];
}

export const ServerList = ({ orderedServers }: Props) => {
  return (
    <ServerListBase>
      <EntryContainer>
        <Link href="/">
          <BiRegularHome size={24} color="white" />
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
