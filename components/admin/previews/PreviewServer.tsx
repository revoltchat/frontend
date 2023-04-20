import { Match, Switch, createEffect, on } from "solid-js";

import { useClient } from "@revolt/client";
import { Avatar, Row, Typography } from "@revolt/ui";

export function PreviewServer(props: { server_id?: string }) {
  const client = useClient();
  const server = () => client().servers.get(props.server_id!);

  createEffect(
    on(
      () => server(),
      (server) =>
        !server && props.server_id && client().servers.fetch(props.server_id!)
    )
  );

  return (
    <Switch fallback={props.server_id}>
      <Match when={server()}>
        <Row align>
          <Avatar src={server()!.animatedIconURL} size={32} />
          <Typography variant="legacy-modal-title">{server()!.name}</Typography>
        </Row>
      </Match>
    </Switch>
  );
}
