import { Match, Switch } from "solid-js";

import { Trans } from "@lingui-solid/solid/macro";
import { useMutation } from "@tanstack/solid-query";

import { Modal2, Modal2Props } from "@revolt/ui";

import { useModals } from "..";
import { Modals } from "../types";

export function ChannelToggleMatureModal(
  props: Modal2Props & Modals & { type: "channel_toggle_mature" },
) {
  const { openModal } = useModals();

  const change = useMutation(() => ({
    mutationFn: (nsfw: boolean) => props.channel.edit({ nsfw }),
    onError: (error) => openModal({ type: "error2", error }),
  }));

  return (
    <Modal2
      show={props.show}
      onClose={props.onClose}
      title={
        <Switch fallback={<Trans>Mark this channel as mature?</Trans>}>
          <Match when={props.channel.mature}>
            <Trans>Unmark this channel as mature?</Trans>
          </Match>
        </Switch>
      }
      actions={[
        { text: <Trans>Keep as is</Trans> },
        {
          text: (
            <Switch fallback={<Trans>Mark as mature</Trans>}>
              <Match when={props.channel.mature}>
                <Trans>Unmark as mature</Trans>
              </Match>
            </Switch>
          ),
          onClick: () => change.mutate(!props.channel.mature),
        },
      ]}
      isDisabled={change.isPending}
    >
      <Switch
        fallback={
          <Trans>
            Users will be asked to confirm their age before joining this
            channel.
          </Trans>
        }
      >
        <Match when={props.channel.mature}>
          <Trans>
            Users will no longer be asked to confirm their age before joining
            this channel.
            <wbr /> Please ensure the content is appropriate for all ages.
          </Trans>
        </Match>
      </Switch>
    </Modal2>
  );
}
