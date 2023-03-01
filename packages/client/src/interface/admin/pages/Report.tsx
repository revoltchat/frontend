import { createEffect, createSignal, For, Match, Switch } from "solid-js";
import { useClient } from "@revolt/client";
import { Avatar, Column, Message, Row, styled, Typography } from "@revolt/ui";
import { TabProps } from "../Admin";

const MutedList = styled(Column)`
  filter: brightness(0.5);
  flex-direction: column-reverse;
`;

function Snapshot(props: { snapshot: any }) {
  const client = useClient();

  return (
    <Column>
      <Typography variant="label">Snapshot Context</Typography>
      <Row>
        <Column>
          <Typography variant="legacy-settings-description">Server</Typography>
        </Column>
      </Row>
      <Typography variant="label">Content</Typography>
      <Switch>
        <Match when={props.snapshot?.content._type === "Message"}>
          <MutedList>
            <For each={props.snapshot!.content._prior_context}>
              {(message) => (
                <Message message={client.messages.createObj(message, false)} />
              )}
            </For>
          </MutedList>
          <Message
            message={client.messages.createObj(props.snapshot!.content, false)}
          />
          <MutedList>
            <For each={props.snapshot!.content._leading_context}>
              {(message) => (
                <Message message={client.messages.createObj(message, false)} />
              )}
            </For>
          </MutedList>
        </Match>
      </Switch>
    </Column>
  );
}

export function Report(props: TabProps<"report">) {
  const client = useClient();
  const [snapshot, setSnapshot] = createSignal<any>();

  createEffect(() =>
    client.api
      .get(`/safety/snapshot/${props.state().report._id}` as any)
      .then(setSnapshot)
  );

  return (
    <Column>
      <Typography variant="legacy-settings-title">
        Report ({props.state().report.status})
      </Typography>
      <Row>
        <Typography variant="legacy-modal-title">
          {props.state().report.content.report_reason}
        </Typography>
        <Typography variant="legacy-modal-title-2">
          {props.state().report.additional_context}
        </Typography>
      </Row>
      <span style="color: white">
        <Snapshot snapshot={snapshot()} />
        {JSON.stringify(snapshot(), undefined, "\t")}
      </span>
    </Column>
  );
}
