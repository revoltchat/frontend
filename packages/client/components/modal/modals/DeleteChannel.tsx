import { Match, Switch } from "solid-js";

import { Trans } from "@lingui-solid/solid/macro";

import { createFormModal } from "../form";
import { PropGenerator } from "../types";

/**
 * Modal to delete a channel
 */
const DeleteChannel: PropGenerator<"delete_channel"> = (props) => {
  return createFormModal({
    modalProps: {
      title: (
        <Switch fallback={<Trans>Delete {props.channel.name}?</Trans>}>
          <Match when={props.channel.type === "Group"}>
            <Trans>Leave {props.channel.name}?</Trans>
          </Match>
          <Match when={props.channel.type === "DirectMessage"}>
            <Trans>
              Close conversation with {props.channel.recipient?.displayName}?
            </Trans>
          </Match>
        </Switch>
      ),
      description: (
        <Switch
          fallback={<Trans>Once it's deleted, there's no going back.</Trans>}
        >
          <Match when={props.channel.type === "Group"}>
            <Trans>
              You won't be able to rejoin unless you are re-invited.
            </Trans>
          </Match>
          <Match when={props.channel.type === "DirectMessage"}>
            <Trans>
              You can re-open it later, but it will disappear on both sides.
            </Trans>
          </Match>
        </Switch>
      ),
    },
    schema: {},
    data: {},
    callback: () => props.channel.delete(),
    submit: {
      variant: "error",
      children: (
        <Switch fallback={<Trans>Delete</Trans>}>
          <Match when={props.channel.type === "Group"}>
            <Trans>Leave</Trans>
          </Match>
          <Match when={props.channel.type === "DirectMessage"}>
            <Trans>Close</Trans>
          </Match>
        </Switch>
      ),
    },
  });
};

export default DeleteChannel;
