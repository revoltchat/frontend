import { useClient } from "@revolt/client";
import { Component, createMemo, Show } from "solid-js";
import { Route, Routes, useParams } from "@revolt/routing";
import { ServerList, HomeSidebar, ServerSidebar } from "@revolt/ui";
import { state } from "@revolt/state";

/**
 * Render sidebar for a server
 */
const Server: Component = () => {
  const params = useParams();
  const client = useClient();
  const server = () => client.servers.get(params.server)!;

  return (
    <Show when={server()}>
      <ServerSidebar server={server()} channelId={params.channel} />
    </Show>
  );
};

/**
 * Render sidebar for home
 */
const Home: Component = () => {
  const params = useParams();
  const client = useClient();

  const conversations = createMemo(() => {
    const arr = [...client.channels.values()].filter(
      ({ channel_type }) =>
        channel_type === "DirectMessage" || channel_type === "Group"
    );

    arr.sort((a, b) => b.updatedAt - a.updatedAt);
    return arr;
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
      __tempDisplayFriends={() => state.experiments.isEnabled("friends")}
    />
  );
};

/**
 * Left-most channel navigation sidebar
 */
export const Sidebar: Component = () => {
  const client = useClient();

  // TODO: shouldn't have separate route for sidebars because they re-render

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
        <Route path="/admin" element={() => null} />
        <Route path="/*" component={Home} />
      </Routes>
    </div>
  );
};
