import { AuthPage } from "@revolt/auth";
import { Button, ServerList } from "@revolt/ui";
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
          <Link href={`/server/${params.server}/channel/${id}`}>
            <Button>{id}</Button>
          </Link>
        )}
      </For>
    </div>
  );
};

const Channel: Component = () => {
  const params = useParams();
  const client = useClient();
  const channel = () => client.channels.get(params.channel); //!

  return (
    <div>
      we are in {channel()?.name ?? "unknown channel"}
      <br />
      <input id="trolling" />
      <button
        onClick={() => {
          let content = (
            document.querySelector("#trolling") as HTMLInputElement
          ).value;
          channel()?.sendMessage({ content });
        }}
      >
        send
      </button>
    </div>
  );
};

const Interface: Component = () => {
  if (!clientController.isLoggedIn()) {
    return <Navigate href="/login" replace />;
  }

  const client = useClient();

  return (
    <div style={{ display: "flex", gap: "4px", height: "100%" }}>
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

export default Interface;
