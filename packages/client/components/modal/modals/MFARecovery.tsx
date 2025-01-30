import { For, createSignal } from "solid-js";

import { useTranslation } from "@revolt/i18n";
import { styled } from "styled-system/jsx";

import { modalController } from "..";
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
  const t = useTranslation();

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
    title: t("app.special.modals.mfa.recovery_codes"),
    description: t("app.special.modals.mfa.save_codes"),
    actions: [
      {
        palette: "primary",
        children: t("app.special.modals.actions.done"),
        onClick: () => true,
        confirmation: true,
      },
      {
        palette: "plain",
        children: t("app.special.modals.actions.reset"),
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
