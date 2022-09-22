import { clientController, useClient } from "@revolt/client";
import { ServerList } from "@revolt/ui";
import { Navigate } from "@solidjs/router";
import { For } from "solid-js";

export function HomeTesting() {
  /*if (!clientController.isLoggedIn()) {
    return <Navigate href="/login" replace />;
  }*/

  const client = useClient();

  const changeStatus = () => {
    if (client.user?.status?.presence === "Focus") {
      client.users.edit({
        status: {
          presence: "Busy",
        },
      });
    } else {
      client.users.edit({
        status: {
          presence: "Focus",
        },
      });
    }
  };

  return (
    <div>
      <span>Hello, {client.user?.username ?? "no username yet"}!</span>
      <div>(status = {client.user?.status?.presence ?? "Online"})</div>
      <button onClick={changeStatus}>change status</button>
      <div>
        your servers:
        <ul>
          <For each={[...client.servers.values()]}>
            {({ name }) => <li>{name}</li>}
          </For>
        </ul>
      </div>
      <div>
        <ServerList />
      </div>
    </div>
  );
}
