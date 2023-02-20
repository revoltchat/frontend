import { useClient } from "@revolt/client";
import { Component, createMemo } from "solid-js";
import { Route, Routes, useParams } from "@revolt/routing";
import { ServerList, HomeSidebar, ServerSidebar } from "@revolt/ui";

/**
 * Render sidebar for a server
 */
const Server: Component = () => {
  const params = useParams();
  const client = useClient();
  const server = () => client.servers.get(params.server)!;

  // TODO validate server existence

  return <ServerSidebar server={server()} channelId={params.channel} />;
};

/**
 * Render sidebar for home
 */
const Home: Component = () => {
  const params = useParams();
  const client = useClient();

  // TODO validate channel existence

  const conversations = createMemo(() => {
    const arr = [...client.channels.values()].filter(
      ({ channel_type }) =>
        channel_type === "DirectMessage" || channel_type === "Group"
    );

    arr.sort((a, b) => b.updatedAt - a.updatedAt);
    return arr.slice(0, 20);
  });

  return (
    <HomeSidebar
      conversations={conversations}
      channelId={params.channel}
      openSavedNotes={(navigate) => {
        // Check whether the saved messages channel exists already
        let channelId = [...client.channels.values()].find(
          (channel) => channel.channel_type === "SavedMessages"
        )?._id;

        // If not, try to create one but only if navigating
        if (navigate) {
          (async () => {
            if (!channelId) {
              channelId = (await client.user!.openDM())._id;
            }

            navigate(`/channel/${channelId}`);
          })();
        }

        // Return channel ID if available
        return channelId;
      }}
    />
  );
};

/**
 * Left-most channel navigation sidebar
 */
export const Sidebar: Component = () => {
  const client = useClient();

  return (
    <div style={{ display: "flex", "flex-shrink": 0 }}>
      <ServerList
        orderedServers={[...client.servers.values()]}
        user={client.user!}
      />
      <Routes>
        <Route path="/server/:server/channel/:channel/*" component={Server} />
        <Route path="/server/:server/*" component={Server} />
        <Route path="/channel/:channel/*" component={Home} />
        <Route path="/*" component={Home} />
      </Routes>
    </div>
  );
};
