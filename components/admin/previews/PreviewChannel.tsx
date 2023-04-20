import { BiRegularHash } from "solid-icons/bi";
import { Match, Switch, createEffect, on } from "solid-js";

import { useClient } from "@revolt/client";
import { Avatar, Row, Typography } from "@revolt/ui";

export function PreviewChannel(props: { channel_id?: string }) {
  const client = useClient();
  const channel = () => client().channels.get(props.channel_id!);

  createEffect(
    on(
      () => channel(),
      (channel) => !channel && client().channels.fetch(props.channel_id!)
    )
  );

  return (
    <Switch fallback={props.channel_id}>
      <Match when={channel()}>
        <Row align>
          <Avatar
            src={channel()!.animatedIconURL}
            fallback={<BiRegularHash size={24} />}
            size={32}
          />
          <Typography variant="legacy-modal-title">
            {channel()!.name} ({channel()!.type})
          </Typography>
        </Row>
      </Match>
    </Switch>
  );
}
