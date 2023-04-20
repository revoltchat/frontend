import { Match, Switch, createEffect, on } from "solid-js";

import { useClient } from "@revolt/client";
import { Avatar, Row, Typography } from "@revolt/ui";

export function PreviewUser(props: { user_id?: string }) {
  const client = useClient();
  const user = () => client().users.get(props.user_id!);

  createEffect(
    on(
      () => user(),
      (user) => !user && client().channels.fetch(props.user_id!)
    )
  );

  return (
    <Switch fallback={props.user_id}>
      <Match when={user()}>
        <Row align>
          <Avatar src={user()!.animatedAvatarURL} size={32} />
          <Typography variant="legacy-modal-title">
            {user()!.username}
          </Typography>
        </Row>
      </Match>
    </Switch>
  );
}
