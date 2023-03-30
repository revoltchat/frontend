import { BiRegularHash } from "solid-icons/bi";
import { For, Show, createEffect, createSignal, on, onMount } from "solid-js";
import { Accessor } from "solid-js";

import { API, Message as MessageI, User } from "revolt.js";

import { useClient } from "@revolt/client";
import { Markdown } from "@revolt/markdown";
import { state } from "@revolt/state";
import {
  Avatar,
  Button,
  Column,
  ComboBox,
  Initials,
  Input,
  Message,
  Row,
  ScrollContainer,
  ServerSidebar,
  Typography,
  styled,
} from "@revolt/ui";

import { MessageQuery } from "../MessageQuery";
import { InspectorLink } from "../previews/InspectorLink";
import { PreviewChannel } from "../previews/PreviewChannel";
import { PreviewServer } from "../previews/PreviewServer";

export const ChannelPreview = styled(ScrollContainer)`
  height: 640px;
  border: 2px solid ${(props) => props.theme!.colours["background-400"]};
`;

function UserInfo(props: { user: Accessor<User> }) {
  const [profile, setProfile] = createSignal<API.UserProfile>();

  createEffect(
    on(
      () => props.user(),
      (user) => {
        if (user) {
          user.fetchProfile().then(setProfile);
        }
      }
    )
  );

  const query: Accessor<API.MessageQuery | undefined> = () =>
    props.user()
      ? {
          author: props.user()!._id,
          limit: 150,
        }
      : undefined;

  return (
    <Column>
      <Typography variant="label">Profile</Typography>
      <Markdown content={profile()?.content ?? "Description is empty"} />
      <Typography variant="label">Recent Messages</Typography>
      <MessageQuery query={query()} preview />
    </Column>
  );
}

export function Inspector() {
  const data = () => state.admin.getActiveTab<"inspector">()!;

  const client = useClient();
  const user = () => client.users.get(data().id!);
  const server = () => client.servers.get(data().id!);
  const channel = () => client.channels.get(data().id!);
  const message = () => client.messages.get(data().id!);

  createEffect(
    on(
      () => user(),
      (user) =>
        !user &&
        (data().typeHint === "any" || data().typeHint === "user") &&
        client.users.fetch(data().id!)
    )
  );

  createEffect(
    on(
      () => server(),
      (server) =>
        !server &&
        (data().typeHint === "any" || data().typeHint === "server") &&
        client.servers.fetch(data().id!)
    )
  );

  createEffect(
    on(
      () => channel(),
      (channel) =>
        !channel &&
        (data().typeHint === "any" || data().typeHint === "channel") &&
        client.channels.fetch(data().id!)
    )
  );

  createEffect(
    on(
      () => message(),
      (message) =>
        !message &&
        (data().typeHint === "any" || data().typeHint === "message") &&
        client.messages.fetch(data().id!)
    )
  );

  let last: any = undefined;
  function runCommand(cmd: string) {
    client.channels.get("01G3E05SSC1EQC0M10YHJQKCP4")!.sendMessage(cmd);
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
              onClick={() => runCommand(`/global spam ${user()!._id}`)}
            >
              Spam
            </Button>
            <Button
              palette="error"
              onClick={() => runCommand(`/global term ${user()!._id}`)}
            >
              Term
            </Button>
            <Button
              palette="error"
              onClick={() => runCommand(`/global ban ${user()!._id}`)}
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
                src={server()!.generateIconURL()}
                fallback={<Initials input={server()!.name} />}
                size={64}
              />
              <Typography variant="legacy-modal-title">
                {server()!.name}
              </Typography>
            </Row>
          </summary>

          <div style={{ "pointer-events": "none" }}>
            <ServerSidebar server={server()!} channelId={undefined} />
          </div>
        </details>
      </Show>
      <Show when={channel()}>
        <details open>
          <summary>
            <PreviewChannel channel_id={data()!.id} />
          </summary>

          <Typography variant="label">Server</Typography>
          <InspectorLink type="server" id={channel()!.server_id!} />

          <Typography variant="label">Messages</Typography>
          <ChannelPreview>
            {/*<Messages channel={channel()!} limit={100} />*/}
            disabled
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
          <InspectorLink type="user" id={message()!.author_id} />
          <Typography variant="label">Channel</Typography>
          <InspectorLink type="channel" id={message()!.channel_id} />

          <Message message={message()!} />
        </details>
      </Show>
    </Column>
  );
}
