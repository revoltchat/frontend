import { CONFIGURATION } from "@revolt/common";
import { useTranslation } from "@revolt/i18n";
import { Link, useNavigate } from "@revolt/routing";
import { Button, Typography } from "@revolt/ui";

import { clientController } from "../../../client";

import { FlowTitle } from "./Flow";
import { setFlowCheckEmail } from "./FlowCheck";
import { Fields, Form } from "./Form";

/**
 * Flow for creating a new account
 */
export default function FlowCreate() {
  const t = useTranslation();
  const navigate = useNavigate();

  /**
   * Create an account
   * @param data Form Data
   */
  async function create(data: FormData) {
    const email = data.get("email") as string;
    const password = data.get("password") as string;
    const captcha = data.get("captcha") as string;

    await clientController.api.post("/auth/account/create", {
      email,
      password,
      captcha,
    });

    // FIXME: should tell client if email was sent
    // or if email even needs to be confirmed

    // TODO: log straight in if no email confirmation?

    setFlowCheckEmail(email);
    navigate("/login/check", { replace: true });
  }

  return (
    <>
      <FlowTitle subtitle={t("login.subtitle2")} emoji="wave">
        {t("login.welcome2")}
      </FlowTitle>
      <Form onSubmit={create} captcha={CONFIGURATION.HCAPTCHA_SITEKEY}>
        <Fields fields={["email", "password"]} />
        <Button type="submit">{t("login.register")}</Button>
      </Form>
      <Typography variant="legacy-settings-description">
        {t("login.existing")} <Link href="..">{t("login.remembered")}</Link>
      </Typography>
    </>
  );
}
