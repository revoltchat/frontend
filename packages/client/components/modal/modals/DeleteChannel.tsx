import { Match, Switch } from "solid-js";

import { Trans } from "@lingui-solid/solid/macro";
import { useMutation } from "@tanstack/solid-query";

import { Dialog, DialogProps } from "@revolt/ui";

import { useModals } from "..";
import { Modals } from "../types";

/**
 * Modal to delete a channel
 */
export function DeleteChannelModal(
  props: DialogProps & Modals & { type: "delete_channel" },
) {
  const { showError } = useModals();
  
const deleteChannel = useMutation(() => ({
  mutationFn: async () => {
    if (!props.channel) return;
    try {
      await props.channel.delete();
    } catch (err: any) {
      console.error("Failed to delete channel:", err);
      if (err?.message?.includes("Unexpected end of JSON")) {
        return;
      }
      throw err;
    }
  },
  onSettled: () => props.onClose?.(),
  onError: showError,
}));

  return (
    <Dialog
      show={props.show}
      onClose={props.onClose}
      title={
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
      }
      actions={[
        { text: <Trans>Cancel</Trans> },
        {
          text: (
            <Switch fallback={<Trans>Delete</Trans>}>
              <Match when={props.channel.type === "Group"}>
                <Trans>Leave</Trans>
              </Match>
              <Match when={props.channel.type === "DirectMessage"}>
                <Trans>Close</Trans>
              </Match>
            </Switch>
          ),
          onClick: () => deleteChannel.mutateAsync(),
        },
      ]}
      isDisabled={deleteChannel.isPending}
    >
      <Switch
        fallback={<Trans>Once it's deleted, there's no going back.</Trans>}
      >
        <Match when={props.channel.type === "Group"}>
          <Trans>You won't be able to rejoin unless you are re-invited.</Trans>
        </Match>
        <Match when={props.channel.type === "DirectMessage"}>
          <Trans>
            You can re-open it later, but it will disappear on both sides.
          </Trans>
        </Match>
      </Switch>
    </Dialog>
  );
}
