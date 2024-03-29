import { useTranslation } from "@revolt/i18n";

import { PropGenerator } from "../types";

/**
 * Modal to display server information
 */
const SignOutSessions: PropGenerator<"sign_out_sessions"> = (props) => {
  const t = useTranslation();

  /**
   * Confirm session sign out
   */
  const confirm = () => props.client.sessions.deleteAll().then(() => true);

  return {
    title: t("app.special.modals.sessions.title"),
    children: t("app.special.modals.sessions.short"),
    actions: [
      {
        palette: "accent",
        onPress: () => true,
        children: t("app.special.modals.actions.cancel"),
      },
      {
        onPress: confirm,
        children: t("app.special.modals.sessions.accept"),
      },
    ],
  };
};

export default SignOutSessions;
