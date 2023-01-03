import { FlowTitle } from "./Flow";
import { Button, Typography } from "@revolt/ui";
import { Fields, Form } from "./Form";
import { Link, useNavigate } from "@revolt/routing";
import { clientController } from "@revolt/client";
import { useTranslation } from "@revolt/i18n";
import { setFlowCheckEmail } from "./FlowCheck";

/**
 * Flow for resending email verification
 */
export default function FlowResend() {
  const t = useTranslation();
  const navigate = useNavigate();

  async function resend(data: FormData) {
    const email = data.get("email") as string;
    const captcha = data.get("captcha") as string;

    await clientController
      .getAnonymousClient()
      .api.post("/auth/account/reverify", {
        email,
        captcha,
      });

    setFlowCheckEmail(email);
    navigate("/login/check", { replace: true });
  }

  return (
    <>
      <FlowTitle>{t("login.resend")}</FlowTitle>
      <Form onSubmit={resend} captcha={import.meta.env.VITE_HCAPTCHA_SITEKEY}>
        <Fields fields={["email"]} />
        <Button type="submit">{t("login.resend")}</Button>
      </Form>
      <Typography variant="legacy-settings-description">
        <Link href="..">{t("login.remembered")}</Link>
      </Typography>
    </>
  );
}
