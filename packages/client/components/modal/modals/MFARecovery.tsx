import { For, createSignal } from "solid-js";

import { Trans } from "@lingui-solid/solid/macro";
import { styled } from "styled-system/jsx";

import { useModals } from "..";
import { PropGenerator } from "../types";

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
  const { mfaFlow } = useModals();

  // Keep track of changes to recovery codes
  // eslint-disable-next-line solid/reactivity
  const [known, setCodes] = createSignal(props.codes);

  /**
   * Reset recovery codes
   */
  const reset = async () => {
    const ticket = await mfaFlow(props.mfa);
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
