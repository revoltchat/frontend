import { createSignal } from "solid-js";

import { useTranslation } from "@revolt/i18n";
import { styled } from "@revolt/ui";

import { modalController } from "..";
import { PropGenerator } from "../types";

/**
 * List of recovery codes
 */
const List = styled.div`
  display: grid;
  text-align: center;
  grid-template-columns: 1fr 1fr;
  font-family: var(--monospace-font), monospace;

  span {
    user-select: text;
  }

  i {
    opacity: 0;
    position: absolute;
  }
`;

/**
 * Modal to display a list of recovery codes
 */
const MFARecovery: PropGenerator<"mfa_recovery"> = (props) => {
  const t = useTranslation();

  // Keep track of changes to recovery codes
  const [known, setCodes] = createSignal(props.codes);

  // Subroutine to reset recovery codes
  const reset = async () => {
    const ticket = await modalController.mfaFlow(props.client);
    if (ticket) {
      const codes = await props.client.api.patch(
        "/auth/mfa/recovery",
        undefined,
        {
          headers: {
            "X-MFA-Ticket": ticket.token,
          },
        }
      );

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
        {known().map((code, index) => (
          <span>
            {code} {index !== known.length && <i>{","}</i>}
          </span>
        ))}
      </List>
    ),
  };
};

export default MFARecovery;
