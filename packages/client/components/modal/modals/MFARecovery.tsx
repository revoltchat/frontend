import { For, createSignal } from "solid-js";

import { styled } from "styled-system/jsx";

import { modalController } from "..";
import { PropGenerator } from "../types";
import { Trans } from "@lingui-solid/solid/macro";

/**
 * List of recovery codes
 */
const List = styled("div", {
  base: {
    display: "grid",
    textAlign: "center",
    gridTemplateColumns: "1fr 1fr",
    fontFamily: "var(--monospace-font), monospace",
    "& span": {
      userSelect: "text",
    },
    "& i": {
      opacity: 0,
      position: "absolute",
    },
  },
});

/**
 * Modal to display a list of recovery codes
 */
const MFARecovery: PropGenerator<"mfa_recovery"> = (props) => {
  // Keep track of changes to recovery codes
  // eslint-disable-next-line solid/reactivity
  const [known, setCodes] = createSignal(props.codes);

  /**
   * Reset recovery codes
   */
  const reset = async () => {
    const ticket = await modalController.mfaFlow(props.mfa);
    if (ticket) {
      const codes = await ticket.generateRecoveryCodes();
      setCodes(codes);
    }

    return false;
  };

  return {
    title: <Trans>Your recovery codes</Trans>,
    description: <Trans>Please save these to a safe location.</Trans>,
    actions: [
      {
        palette: "primary",
        children: <Trans>Done</Trans>,
        onClick: () => true,
        confirmation: true,
      },
      {
        palette: "plain",
        children: <Trans>Reset</Trans>,
        onClick: reset,
      },
    ],
    children: (
      <List>
        <For each={known()}>
          {(code, index) => (
            <span>
              {code} {index() !== known.length && <i>{","}</i>}
            </span>
          )}
        </For>
      </List>
    ),
  };
};

export default MFARecovery;
