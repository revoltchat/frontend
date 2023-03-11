import { BiRegularHash } from "solid-icons/bi";
import {
  For,
  Match,
  Show,
  Switch,
  createEffect,
  createSignal,
  on,
  onMount,
} from "solid-js";

import { API, Message as MessageI } from "revolt.js";

import { useClient } from "@revolt/client";
import { state } from "@revolt/state";
import {
  Avatar,
  Button,
  Column,
  Message,
  Row,
  Typography,
  styled,
} from "@revolt/ui";

import { InspectorLink } from "../previews/InspectorLink";
import { PreviewMessage } from "../previews/PreviewMessage";
import { PreviewUser } from "../previews/PreviewUser";

const FixedColumn = styled(Column)`
  min-width: 0;
`;

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
        <For each={props.content._prior_context as unknown as MessageI[]}>
          {(message: MessageI) => <PreviewMessage message_id={message._id!} />}
        </For>
      </MutedList>
      <PreviewMessage message_id={props.content._id!} />
      <MutedList>
        <For each={props.content._leading_context as unknown as MessageI[]}>
          {(message) => <PreviewMessage message_id={message._id!} />}
        </For>
      </MutedList>
    </>
  );
}

function Snapshot(props: { id: string }) {
  const snapshot = () => state.admin.getSnapshot(props.id)!;
  const server = () =>
    snapshot().content._type === "Server"
      ? snapshot().content._id
      : snapshot()._server?._id!;
  const user = () =>
    snapshot().content._type === "User"
      ? snapshot().content._id
      : (
          snapshot().content as API.SnapshotContent & {
            _type: "Message";
          }
        )?.author!;
  const channel = () =>
    (
      snapshot().content as API.SnapshotContent & {
        _type: "Message";
      }
    )?.channel;

  return (
    <FixedColumn>
      <Typography variant="label">Snapshot Context</Typography>
      <Row>
        <Show when={server()}>
          <Column justify>
            <Typography variant="legacy-settings-description">
              <Switch fallback={"Server"}>
                <Match when={snapshot().content._type === "Server"}>
                  Reported Server
                </Match>
              </Switch>
            </Typography>
            <InspectorLink type="server" id={server()} />
          </Column>
        </Show>
        <Show when={channel()}>
          <Column justify>
            <Typography variant="legacy-settings-description">
              Channel
            </Typography>
            <InspectorLink type="channel" id={channel()} />
          </Column>
        </Show>
        <Show when={user()}>
          <Column justify>
            <Typography variant="legacy-settings-description">
              <Switch fallback={"Author"}>
                <Match when={snapshot().content._type === "User"}>
                  Reported User
                </Match>
              </Switch>
            </Typography>
            <InspectorLink type="user" id={user()} />
          </Column>
        </Show>
      </Row>
      <Switch>
        <Match when={snapshot().content._type === "Message"}>
          <Typography variant="label">Content</Typography>
          <MessageSnapshot content={snapshot().content as any} />
        </Match>
      </Switch>
      <Typography variant="label">JSON Dump</Typography>
      <pre>
        <code>{JSON.stringify(snapshot(), null, "\t")}</code>
      </pre>
    </FixedColumn>
  );
}

export function Report() {
  const data = () => state.admin.getActiveTab<"report">()!;
  const report = () => state.admin.getReport(data().id);
  const snapshot = () => state.admin.getSnapshot(data().id)!;

  const [notes, setNotes] = createSignal<string>();

  function status() {
    const value = report()!;
    if (value.status === "Rejected") {
      return `Rejected: ${value.rejection_reason}`;
    } else {
      return value.status;
    }
  }

  return (
    <Show when={report()}>
      <Column>
        <Typography variant="legacy-settings-title">
          Report ({status()})
        </Typography>
        <Typography variant="legacy-settings-subtitle">
          ID: {report()!._id}
        </Typography>
        <Typography variant="label">Author ({report()!.author_id})</Typography>
        <InspectorLink type="user" id={report()!.author_id} />
        <Row>
          <Typography variant="legacy-modal-title">
            {report()!.content.report_reason}
          </Typography>
          <Typography variant="legacy-modal-title-2">
            {report()!.additional_context}
          </Typography>
        </Row>
        <textarea
          value={report()!.notes ?? notes() ?? ""}
          onInput={(ev) => setNotes(ev.currentTarget.value)}
        />
        <Button
          palette="primary"
          disabled={notes() === report()!.notes}
          onClick={() =>
            state.admin.editReport(data().id, {
              notes: notes(),
            })
          }
        >
          Save
        </Button>
        <Switch
          fallback={
            <Button
              palette="warning"
              onClick={() =>
                state.admin.editReport(data().id, {
                  status: {
                    status: "Created",
                  },
                })
              }
            >
              Mark as created
            </Button>
          }
        >
          <Match when={report()!.status === "Created"}>
            <Button
              palette="success"
              onClick={() =>
                state.admin.editReport(data().id, {
                  status: {
                    status: "Resolved",
                  },
                })
              }
            >
              Mark as resolved
            </Button>
            <Button
              palette="error"
              onClick={() => {
                const rejection_reason = prompt("Rejection reason");
                if (rejection_reason) {
                  state.admin.editReport(data().id, {
                    status: {
                      status: "Rejected",
                      rejection_reason,
                    },
                  });
                }
              }}
            >
              Mark as rejected
            </Button>
          </Match>
        </Switch>
        <span style="color: white">
          <Show when={snapshot()}>
            <Snapshot id={data().id} />
          </Show>
        </span>
      </Column>
    </Show>
  );
}
