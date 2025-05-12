import { Match, Switch, createSignal, onMount } from "solid-js";

import { Trans } from "@lingui-solid/solid/macro";
import { styled } from "styled-system/jsx";

import { CONFIGURATION } from "@revolt/common";

import { useModals } from "..";
import { createFormModal } from "../form";
import { PropGenerator } from "../types";

/**
 * Code block which displays invite
 */
const Invite = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",

    "& code": {
      padding: "1em",
      userSelect: "all",
      fontSize: "1.4em",
      textAlign: "center",
      fontFamily: "var(--fonts-monospace)",
    },
  },
});

/**
 * Modal to create a new invite
 */
const CreateInvite: PropGenerator<"create_invite"> = (props) => {
  const [processing, setProcessing] = createSignal(false);
  const [link, setLink] = createSignal("...");
  const { openModal } = useModals();

  // Generate an invite code
  onMount(() => {
    setProcessing(true);

    props.channel
      .createInvite()
      .then(({ _id }) =>
        setLink(
          CONFIGURATION.IS_REVOLT
            ? `https://rvlt.gg/${_id}`
            : `${window.location.protocol}//${window.location.host}/invite/${_id}`,
        ),
      )
      .catch((err) => openModal({ type: "error", error: err }))
      .finally(() => setProcessing(false));
  });

  return createFormModal({
    modalProps: {
      title: <Trans>Create Invite</Trans>,
    },
    schema: {
      invite: "custom",
    },
    data: {
      invite: {
        element: (
          <Switch fallback={<Trans>Generating invite…</Trans>}>
            <Match when={!processing()}>
              <Invite>
                <Trans>
                  Here is your new invite code: <code>{link()}</code>
                </Trans>
              </Invite>
            </Match>
          </Switch>
        ),
      },
    },
    callback: async () => void 0,
    submit: {
      children: <Trans>OK</Trans>,
    },
    actions: [
      {
        children: <Trans>Copy Link</Trans>,
        onClick: () => {
          navigator.clipboard.writeText(link());
        },
      },
    ],
  });
};

export default CreateInvite;
