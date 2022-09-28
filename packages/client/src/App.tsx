import { AuthPage } from "@revolt/auth";
import { ServerList } from "@revolt/ui";
import { clientController, useClient } from "@revolt/client";
import { Link, Navigate, Route, Routes, useParams } from "@revolt/routing";

import { Component, For } from "solid-js";

const ServerSidebar: Component = () => {
  const params = useParams();
  const client = useClient();
  const server = () => client.servers.get(params.server)!; //!

  return (
    <div>
      server sidebar for {params.server}
      <br />
      <For each={server().channel_ids}>
        {(id) => (
          <div>
            <Link href={`/server/${params.server}/channel/${id}`}>{id}</Link>
          </div>
        )}
      </For>
    </div>
  );
};

const Channel: Component = () => {
  const params = useParams();
  const client = useClient();
  const channel = () => client.channels.get(params.channel); //!

  return <div>we are in {channel()?.name ?? "unknown channel"}</div>;
};

const Layout: Component = () => {
  if (!clientController.isLoggedIn()) {
    return <Navigate href="/login" replace />;
  }

  const client = useClient();

  return (
    <div style={{ display: "flex", gap: "4px" }}>
      <ServerList orderedServers={[...client.servers.values()]} />
      <Routes>
        <Route path="/server/:server/*" element={<ServerSidebar />} />
        <Route path="/*" element={<span>home sidebar</span>} />
      </Routes>
      <Routes>
        <Route
          path="/server/:server/*"
          element={
            <Routes>
              <Route path="/channel/:channel" element={<Channel />} />
              <Route path="/*" element={<span>server!</span>} />
            </Routes>
          }
        />
        <Route path="/channel/:channel" element={<Channel />} />
        <Route path="/*" element={<span>home sidebar</span>} />
      </Routes>
    </div>
  );
};

const App: Component = () => {
  return (
    <Routes>
      <Route path="/login/*" element={<AuthPage />} />
      <Route path="/*" element={<Layout />} />
    </Routes>
  );
};

export default App;
