import { For, Show, createEffect, createSignal, on } from "solid-js";
import { Accessor } from "solid-js";

import { API, User } from "revolt.js";

import { Message, Messages, SettingsUsingConfiguration } from "@revolt/app";
import { useClient } from "@revolt/client";
import { Markdown } from "@revolt/markdown";
import { state } from "@revolt/state";
import {
  Avatar,
  Button,
  Column,
  ComboBox,
  FormGroup,
  Initials,
  Input,
  Row,
  ServerSidebar,
  Typography,
  styled,
} from "@revolt/ui";

import { MessageQuery } from "../MessageQuery";
import { InspectorLink } from "../previews/InspectorLink";
import { PreviewChannel } from "../previews/PreviewChannel";

export const ChannelPreview = styled.div`
  height: 640px;
  border: 2px solid ${(props) => props.theme!.colours["background-400"]};
`;

function UserInfo(props: { user: Accessor<User | undefined> }) {
  const client = useClient();
  const [profile, setProfile] = createSignal<API.UserProfile>();
  const [strikes, setStrikes] = createSignal<API.AccountStrike[]>([]);

  const [reason, setReason] = createSignal("");

  createEffect(
    on(
      () => props.user(),
      (user) => {
        if (user) {
          user.fetchProfile().then(setProfile);

          client()
            .api.get(`/safety/strikes/${user.id}` as any)
            .then((strikes) => setStrikes(strikes as never));
        }
      }
    )
  );

  const query: Accessor<API.MessageQuery | undefined> = () =>
    props.user()
      ? {
          author: props.user()!.id,
          limit: 150,
        }
      : undefined;

  return (
    <Column>
      <Typography variant="label">Profile</Typography>
      <Markdown content={profile()?.content ?? "Description is empty"} />
      <Typography variant="label">Strikes</Typography>
      <Show when={!strikes().length}>No strikes.</Show>
      <ol>
        <For each={strikes()}>
          {(strike) => (
            <li>
              {strike.reason}{" "}
              <Button
                onClick={() =>
                  client()
                    .api.delete(`/safety/strikes/${strike._id}`)
                    .then(() =>
                      setStrikes((strikes) =>
                        strikes.filter((entry) => entry._id !== strike._id)
                      )
                    )
                }
              >
                remove
              </Button>
            </li>
          )}
        </For>
      </ol>
      <FormGroup>
        <Row align>
          <Input
            value={reason()}
            onInput={(event) => setReason(event.currentTarget.value)}
          />
          <Button
            disabled={!reason()}
            onClick={() => {
              client()
                .api.post("/safety/strikes", {
                  user_id: props.user()!.id,
                  reason: reason(),
                })
                .then((strike) =>
                  setStrikes((strikes) => [...strikes, strike])
                );

              setReason("");
            }}
          >
            Create
          </Button>
        </Row>
      </FormGroup>
      <Typography variant="label">Recent Messages</Typography>
      <MessageQuery query={query()} preview />
    </Column>
  );
}

export function Inspector() {
  const data = () => state.admin.getActiveTab<"inspector">()!;

  const client = useClient();
  const user = () => client().users.get(data().id!);
  const server = () => client().servers.get(data().id!);
  const channel = () => client().channels.get(data().id!);
  const message = () => client().messages.get(data().id!);

  createEffect(
    on(
      () => user(),
      (user) =>
        !user &&
        (data().typeHint === "any" || data().typeHint === "user") &&
        client().users.fetch(data().id!)
    )
  );

  createEffect(
    on(
      () => server(),
      (server) =>
        !server &&
        (data().typeHint === "any" ||
        (data().typeHint === "server" && data().id?.length === 8)
          ? client()
              .api.get(`/invites/${data().id! as ""}`)
              .then((invite) => {
                invite.type === "Server" &&
                  state.admin.setActiveTab({ id: invite.server_id });
              })
          : client()
              .servers.fetch(data().id!)
              .then((server) => {
                for (const id of server.channelIds) {
                  client().channels.fetch(id);
                }
              }))
    )
  );

  createEffect(
    on(
      () => channel(),
      (channel) =>
        !channel &&
        (data().typeHint === "any" || data().typeHint === "channel") &&
        client().channels.fetch(data().id!)
    )
  );

  createEffect(
    on(
      () => message(),
      (message) =>
        !message &&
        (data().typeHint === "any" || data().typeHint === "message") &&
        client().messages.fetch("", data().id!) // TODO: this does not work currently
    )
  );

  let last: any = undefined;
  function runCommand(cmd: string) {
    client().channels.get("01G3E05SSC1EQC0M10YHJQKCP4")!.sendMessage(cmd);
    if (cmd !== last) {
      alert("You must click again to confirm.");
      last = cmd;
    }
  }

  return (
    <Column>
      <Row align>
        <ComboBox
          value={data().typeHint ?? "any"}
          onInput={(ev) =>
            state.admin.setActiveTab<"inspector">({
              typeHint: ev.currentTarget.value as "any",
            })
          }
        >
          <option value="any">Any</option>
          <option value="user">User</option>
          <option value="server">Server</option>
          <option value="channel">Channel</option>
          <option value="message">Message</option>
        </ComboBox>
        <Input
          placeholder="Enter ID"
          value={data().id ?? ""}
          onInput={(ev) =>
            state.admin.setActiveTab<"inspector">({
              id: ev.currentTarget.value,
            })
          }
        />
        <Button palette="accent">Fetch</Button>
      </Row>
      <Show when={user()}>
        <details open>
          <summary>
            <Row align>
              <Avatar src={user()!.animatedAvatarURL} size={64} />
              <Typography variant="legacy-modal-title">
                {user()!.username}
              </Typography>
            </Row>
          </summary>

          <Typography variant="label">Action</Typography>
          <Row>
            <Button palette="warning" onClick={() => {}}>
              Create Strike
            </Button>
            <Button
              palette="accent"
              onClick={() => runCommand(`/global spam ${user()!.id}`)}
            >
              Spam
            </Button>
            <Button
              palette="error"
              onClick={() => runCommand(`/global term ${user()!.id}`)}
            >
              Term
            </Button>
            <Button
              palette="error"
              onClick={() => runCommand(`/global ban ${user()!.id}`)}
            >
              Ban
            </Button>
          </Row>

          <UserInfo user={user} />
        </details>
      </Show>
      <Show when={server()}>
        <details open>
          <summary>
            <Row align>
              <Avatar
                src={server()!.animatedIconURL}
                fallback={<Initials input={server()!.name} />}
                size={64}
              />
              <Typography variant="legacy-modal-title">
                {server()!.name}
              </Typography>
            </Row>
          </summary>

          <Row>
            <div style={{ "pointer-events": "none" }}>
              <ServerSidebar
                server={server()!}
                channelId={undefined}
                openServerInfo={() => void 0}
                openServerSettings={() => void 0}
              />
            </div>
            <SettingsUsingConfiguration
              configKey="server"
              context={server() as never}
            />
          </Row>
        </details>
      </Show>
      <Show when={channel()}>
        <details open>
          <summary>
            <PreviewChannel channel_id={data()!.id} />
          </summary>

          <Typography variant="label">Server</Typography>
          <InspectorLink type="server" id={channel()!.serverId!} />

          <Typography variant="label">Settings</Typography>
          <SettingsUsingConfiguration
            configKey="channel"
            context={channel() as never}
          />

          <Typography variant="label">Messages</Typography>
          <ChannelPreview>
            <Messages channel={channel()!} limit={100} />
          </ChannelPreview>
        </details>
      </Show>
      <Show when={message()}>
        <details open>
          <summary>
            <Row align>
              <Avatar src={message()!.avatarURL} size={32} />
              <Typography variant="legacy-modal-title">
                {message()!.username}
              </Typography>
              <Typography variant="legacy-modal-title-2">
                {message()!.content?.substring(0, 32)}
              </Typography>
            </Row>
          </summary>

          <Typography variant="label">Author</Typography>
          <InspectorLink type="user" id={message()!.authorId!} />
          <Typography variant="label">Channel</Typography>
          <InspectorLink type="channel" id={message()!.channelId} />

          <Message message={message()!} />
        </details>
      </Show>
    </Column>
  );
}
