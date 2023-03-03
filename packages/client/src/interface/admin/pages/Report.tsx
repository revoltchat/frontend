import { createEffect, createSignal, For, Match, Show, Switch } from "solid-js";
import { useClient } from "@revolt/client";
import {
  Avatar,
  Button,
  Column,
  Message,
  Row,
  styled,
  Typography,
} from "@revolt/ui";
import { API } from "revolt.js";
import { state } from "@revolt/state";

const MutedList = styled(Column)`
  filter: brightness(0.5);
  flex-direction: column-reverse;
`;

function MessageSnapshot(props: {
  content: API.SnapshotWithContext["content"] & { _type: "Message" };
}) {
  const client = useClient();

  return (
    <>
      <MutedList>
        <For each={props.content._prior_context}>
          {(message) => (
            <Message message={client.messages.createObj(message, false)} />
          )}
        </For>
      </MutedList>
      <Message message={client.messages.createObj(props.content, false)} />
      <MutedList>
        <For each={props.content._leading_context}>
          {(message) => (
            <Message message={client.messages.createObj(message, false)} />
          )}
        </For>
      </MutedList>
    </>
  );
}

function Snapshot(props: { id: string }) {
  const client = useClient();
  const snapshot = () => state.admin.getSnapshot(props.id)!;

  return (
    <Column>
      <Typography variant="label">Snapshot Context</Typography>
      <Row>
        <Show when={snapshot()._server}>
          <Column justify>
            <Typography variant="legacy-settings-description">
              Server
            </Typography>
            <Button
              compact="fluid"
              onClick={() =>
                state.admin.addTab({
                  type: "inspector",
                  title: snapshot()._server!.name,
                  id: snapshot()._server!._id,
                  typeHint: "server",
                })
              }
            >
              <Row align>
                <Avatar
                  src={client.servers
                    .createObj(snapshot()._server!)
                    .generateIconURL()}
                  size={64}
                />
                <span>{snapshot()._server!.name}</span>
              </Row>
            </Button>
          </Column>
        </Show>
      </Row>
      <Typography variant="label">Content</Typography>
      <Switch>
        <Match when={snapshot().content._type === "Message"}>
          <MessageSnapshot content={snapshot().content as any} />
        </Match>
      </Switch>
    </Column>
  );
}

export function Report() {
  const data = () => state.admin.getActiveTab<"report">()!;
  const report = () => state.admin.getReport(data().id);
  const snapshot = () => state.admin.getSnapshot(data().id)!;

  const client = useClient();

  return (
    <Show when={report()}>
      <Column>
        <Typography variant="legacy-settings-title">
          Report ({report()!.status})
        </Typography>
        <textarea value={report()!.notes} onInput={(ev) => {}} />
        <Button
          palette="primary"
          onClick={() =>
            client.api.patch(`/safety/reports/${data().id as ""}`, {
              notes: report()!.notes,
              status: {
                status: "Created",
              },
            })
          }
        >
          Save
        </Button>
        <Row>
          <Typography variant="legacy-modal-title">
            {report()!.content.report_reason}
          </Typography>
          <Typography variant="legacy-modal-title-2">
            {report()!.additional_context}
          </Typography>
        </Row>
        <span style="color: white">
          <Show when={snapshot()}>
            <Snapshot id={data().id} />
          </Show>
          {JSON.stringify(snapshot, undefined, "\t")}
        </span>
      </Column>
    </Show>
  );
}
