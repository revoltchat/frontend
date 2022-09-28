import { Link } from "@revolt/routing";
import { Server } from "revolt.js";
import { For } from "solid-js";
import { styled } from "solid-styled-components";
import { Typography } from "../../design/atoms/display/Typography";
import { Button } from "../../design/atoms/inputs";

const Base = styled.div`
  overflow-y: scroll;
  scrollbar-width: thin;

  width: 232px;
  background: ${({ theme }) => theme!.colours["background-200"]};
`;

interface Props {
  server: () => Server;
}

export const ServerSidebar = ({ server }: Props) => {
  return (
    <Base>
      <Typography variant="h2">{server().name}</Typography>
      <For each={server().orderedChannels}>
        {(category) => (
          <div>
            <Typography variant="h3">{category.title}</Typography>
            <For each={category.channels}>
              {(channel) => (
                <Link href={`/server/${server()._id}/channel/${channel._id}`}>
                  <Button palette="primary">{channel.name}</Button>
                </Link>
              )}
            </For>
          </div>
        )}
      </For>
    </Base>
  );
};
