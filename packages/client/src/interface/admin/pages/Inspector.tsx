import { useClient } from "@revolt/client";
import { state } from "@revolt/state";
import {
  Button,
  Column,
  ComboBox,
  Input,
  Row,
  ScrollContainer,
  styled,
  Typography,
} from "@revolt/ui";
import { Show } from "solid-js";
import { Messages } from "../../channels/text/Messages";

const ChannelPreview = styled(ScrollContainer)`
  height: 320px;
`;

export function Inspector() {
  const data = state.admin.getActiveTab<"inspector">()!;

  const client = useClient();
  const user = () => client.users.get(data.id!);
  const server = () => client.servers.get(data.id!);
  const channel = () => client.channels.get(data.id!);

  return (
    <Column>
      <Row align>
        <ComboBox
          value={data.typeHint ?? "any"}
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
        </ComboBox>
        <Input
          placeholder="Enter ID"
          value={data.id ?? ""}
          onInput={(ev) =>
            state.admin.setActiveTab<"inspector">({
              id: ev.currentTarget.value,
            })
          }
        />
        <Button palette="accent">Fetch</Button>
      </Row>
      <Show when={user()}>
        <Typography variant="label">found user</Typography>
      </Show>
      <Show when={server()}>
        <Typography variant="label">found server</Typography>
      </Show>
      <Show when={channel()}>
        <Typography variant="label">found channel</Typography>
        <ChannelPreview>
          <Messages channel={channel()!} />
        </ChannelPreview>
      </Show>
    </Column>
  );
}
