import { FlowTitle } from "./Flow";
import { Button, Typography } from "@revolt/ui";
import { Fields, Form } from "./Form";
import { Link, useNavigate, useParams } from "@revolt/routing";
import { clientController } from "@revolt/client";
import { useTranslation } from "@revolt/i18n";

/**
 * Flow for confirming a new password
 */
export default function FlowConfirmResend() {
  const t = useTranslation();
  const { token } = useParams();
  const navigate = useNavigate();

  async function reset(data: FormData) {
    const password = data.get("password") as string;

    await clientController
      .getAnonymousClient()
      .api.patch("/auth/account/reset_password", {
        password,
        token,
      });

    navigate("../..", { replace: true });
  }

  return (
    <>
      <FlowTitle>{t("login.reset")}</FlowTitle>
      <Form onSubmit={reset}>
        <Fields fields={["password"]} />
        <Button type="submit">{t("login.reset")}</Button>
      </Form>
      <Typography variant="legacy-settings-description">
        <Link href="../..">{t("login.remembered")}</Link>
      </Typography>
    </>
  );
}
