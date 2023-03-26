import { Match, Switch } from "solid-js";

import { state } from "@revolt/state";
import { Button } from "@revolt/ui";

import { PreviewChannel } from "./PreviewChannel";
import { PreviewMessage } from "./PreviewMessage";
import { PreviewServer } from "./PreviewServer";
import { PreviewUser } from "./PreviewUser";

interface LinkProps {
  type: "user" | "server" | "channel" | "message";
  id: string;
}

export function InspectorLink(props: LinkProps) {
  return (
    <Button
      onclick={() =>
        state.admin.addTab({
          title: "Inspect " + props.type,
          type: "inspector",
          typeHint: props.type,
          id: props.id,
        })
      }
    >
      <Switch>
        <Match when={props.type === "user"}>
          <PreviewUser user_id={props.id} />
        </Match>
        <Match when={props.type === "channel"}>
          <PreviewChannel channel_id={props.id} />
        </Match>
        <Match when={props.type === "server"}>
          <PreviewServer server_id={props.id} />
        </Match>
        <Match when={props.type === "message"}>
          <PreviewMessage message_id={props.id} />
        </Match>
      </Switch>
    </Button>
  );
}
