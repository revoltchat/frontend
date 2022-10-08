import { useClient } from "@revolt/client";
import { Link, Route, Routes, useParams } from "@revolt/routing";
import { ServerList, ServerSidebar } from "@revolt/ui";
import { Component, createMemo, For } from "solid-js";

/**
 * Render sidebar for a server
 */
const Server: Component = () => {
  const params = useParams();
  const client = useClient();
  const server = createMemo(() => client.servers.get(params.server)!);
  // TODO validate server existence

  return <ServerSidebar server={server} />;
};

/**
 * Render sidebar for home
 */
const Home: Component = () => {
  const client = useClient();
  // TODO validate server existence

  return (
    <div>
      <For
        each={[...client.channels.values()].filter(
          ({ channel_type }) =>
            channel_type === "DirectMessage" || channel_type === "Group"
        )}
      >
        {(channel) => (
          <div>
            <Link href={`/channel/${channel._id}`}>{channel.name}</Link>
          </div>
        )}
      </For>
    </div>
  );
};

/**
 * Left-most channel navigation sidebar
 */
export const Sidebar: Component = () => {
  const client = useClient();

  return (
    <div style={{ display: "flex", "flex-shrink": 0 }}>
      <ServerList orderedServers={[...client.servers.values()]} />
      <Routes>
        <Route path="/server/:server/*" component={Server} />
        <Route path="/*" component={Home} />
      </Routes>
    </div>
  );
};
