import { useClient } from "@revolt/client";
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
import { TabProps } from "../Admin";
import { NarrowedState } from "../state";

const ChannelPreview = styled(ScrollContainer)`
  height: 320px;
`;

export function Inspector(props: TabProps<"inspector">) {
  const client = useClient();
  const user = () => client.users.get(props.state().id!);
  const server = () => client.servers.get(props.state().id!);
  const channel = () => client.channels.get(props.state().id!);

  return (
    <Column>
      <Row align>
        <ComboBox
          value={props.state().typeHint ?? "any"}
          onInput={(ev) =>
            props.setState({
              typeHint: ev.currentTarget
                .value as NarrowedState<"inspector">["typeHint"],
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
          value={props.state().id ?? ""}
          onInput={(ev) => props.setState({ id: ev.currentTarget.value })}
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
