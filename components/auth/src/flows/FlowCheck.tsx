import { FlowTitle } from "./Flow";
import { Link } from "@revolt/routing";
import { useTranslation } from "@revolt/i18n";
import { MailProvider } from "./MailProvider";
import { Show } from "solid-js";
import { Typography } from "@revolt/ui";

/**
 * Keep track of email within the same session
 */
var email: string = "postmaster@revolt.wtf";

/**
 * Persist email information temporarily
 */
export function setFlowCheckEmail(e: string) {
  email = e;
}

/**
 * Flow to tell the user to check their email
 */
export default function FlowCheck() {
  const t = useTranslation();

  return (
    <>
      <FlowTitle subtitle={t("login.email_delay")} emoji="mail">
        {t("login.check_mail")}
      </FlowTitle>
      <Show when={email}>
        <MailProvider email={email} />
      </Show>
      <Typography variant="subtitle">
        <Link href="..">{t("login.remembered")}</Link>
      </Typography>
    </>
  );
}
