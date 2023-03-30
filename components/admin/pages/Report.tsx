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
  Input,
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

  const client = useClient();
  const [notes, setNotes] = createSignal<string>();

  function status() {
    const value = report()!;
    if (value.status === "Rejected") {
      return `Rejected: ${value.rejection_reason}`;
    } else {
      return value.status;
    }
  }

  function reason() {
    const value = report()!;
    if (value.status === "Rejected") {
      return value.rejection_reason;
    }
  }

  function reject(rejection_reason: string) {
    state.admin.editReport(data().id, {
      status: {
        status: "Rejected",
        rejection_reason,
      },
    });
  }

  function ref() {
    let info = "<unknown object>";
    const snapshot = state.admin.getSnapshot(report()!._id)!;
    switch (snapshot.content._type) {
      case "Message": {
        info = "@" + client.users.get(snapshot.content.author)?.username;
        break;
      }
      case "User": {
        info = "@" + snapshot.content.username;
        break;
      }
      case "Server": {
        info = snapshot.content.name;
        break;
      }
    }

    return `${report()!._id.substring(20, 26)}, ${info}, ${
      report()!.content.report_reason
    }${
      report()!.additional_context ? `, "${report()!.additional_context}"` : ""
    }`;
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
                  reject(rejection_reason);
                }
              }}
            >
              Mark as rejected
            </Button>
          </Match>
        </Switch>
        <Show when={report()!.status === "Created"}>
          <Typography variant="label">Quick Close</Typography>
          <Row>
            <Button onClick={() => reject("invalid")}>Invalid</Button>
            <Button onClick={() => reject("false")}>False or Spam</Button>
            <Button onClick={() => reject("duplicate")}>Duplicate</Button>
            <Button onClick={() => reject("not enough evidence")}>
              Not Enough Evidence
            </Button>
            <Button onClick={() => reject("ignore")}>Ignore</Button>
          </Row>
        </Show>
        <Show when={report()!.status !== "Created"}>
          <Typography variant="label">Quick Respond</Typography>
          <Switch fallback={"No template available for report info."}>
            <Match when={reason() === "invalid"}>
              <TemplateReponse
                id={report()!.author_id}
                message={`Your report (${ref()}) has been marked as invalid.`}
              />
            </Match>
            <Match when={reason() === "false"}>
              <TemplateReponse
                id={report()!.author_id}
                message={`Your report (${ref()}) has been marked as false or spam. False reports may lead to additional action against your account.`}
              />
            </Match>
            <Match when={reason() === "duplicate"}>
              <TemplateReponse
                id={report()!.author_id}
                message={`Your report (${ref()}) has been marked as a duplicate.`}
              />
            </Match>
            <Match when={reason() === "not enough evidence"}>
              <TemplateReponse
                id={report()!.author_id}
                message={`Your report (${ref()}) has not been actioned at this time due to a lack of supporting evidence, if you have additional information to support your report, please either report individual relevant messages or send an email to contact@revolt.chat.`}
              />
            </Match>
            <Match when={report()!.status === "Resolved"}>
              <TemplateReponse
                id={report()!.author_id}
                message={`Your report (${ref()}) has been actioned and appropriate action has been taken.`}
              />
            </Match>
          </Switch>
        </Show>
        <span style={{ color: "white" }}>
          <Show when={snapshot()}>
            <Snapshot id={data().id} />
          </Show>
        </span>
      </Column>
    </Show>
  );
}

function TemplateReponse(props: { id: string; message: string }) {
  const cmd = () => `/global notify ${props.id} ${props.message}`;
  const client = useClient();
  function runCommand() {
    if (confirm("Confirm Message")) {
      client.channels.get("01G3E05SSC1EQC0M10YHJQKCP4")!.sendMessage(cmd());
    }
  }

  return (
    <Row align>
      <Input value={cmd()} disabled />
      <Button palette="accent" onClick={runCommand}>
        Send
      </Button>
    </Row>
  );
}
