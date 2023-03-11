import { BiRegularHash } from "solid-icons/bi";
import { Show, createEffect, on } from "solid-js";

import { useClient } from "@revolt/client";
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

import { Messages } from "../../channels/text/Messages";

const ChannelPreview = styled(ScrollContainer)`
  height: 640px;
`;

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
        <details>
          <summary>
            <Row align>
              <Avatar src={user()!.animatedAvatarURL} size={64} />
              <Typography variant="legacy-modal-title">
                {user()!.username}
              </Typography>
            </Row>
          </summary>
        </details>
      </Show>
      <Show when={server()}>
        <details>
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

          <div style="pointer-events: none">
            <ServerSidebar server={server()!} channelId={undefined} />
          </div>
        </details>
      </Show>
      <Show when={channel()}>
        <details>
          <summary>
            <Row align>
              <Avatar
                src={channel()!.generateIconURL()}
                fallback={<BiRegularHash size={24} />}
                size={32}
              />
              <Typography variant="legacy-modal-title">
                {channel()!.name}
              </Typography>
            </Row>
          </summary>

          <ChannelPreview>
            <Messages channel={channel()!} limit={100} />
          </ChannelPreview>
        </details>
      </Show>
      <Show when={message()}>
        <details>
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

          <Message message={message()!} />
        </details>
      </Show>
    </Column>
  );
}
