import { Link, useNavigate } from "@revolt/routing";
import { clientController } from "../../../client";
import {
  Avatar,
  Button,
  CategoryButton,
  Column,
  styled,
  Typography,
} from "@revolt/ui";
import { useTranslation } from "@revolt/i18n";
import { Fields, Form } from "./Form";
import { FlowTitle } from "./Flow";
import { For, Show } from "solid-js";

/**
 * Account switcher UI
 */
const AccountSwitcher = styled(Column)`
  margin-top: 8px;
`;

/**
 * Flow for logging into an account
 */
export default function FlowLogin() {
  const t = useTranslation();
  const navigate = useNavigate();

  async function login(data: FormData) {
    const email = data.get("email") as string;
    const password = data.get("password") as string;

    await clientController.login({
      email,
      password,
    });

    navigate("/", { replace: true });
  }

  return (
    <>
      <FlowTitle subtitle={t("login.subtitle")} emoji="wave">
        {t("login.welcome")}
      </FlowTitle>
      <Form onSubmit={login}>
        <Fields fields={["email", "password"]} />
        <Button type="submit">{t("login.title")}</Button>
      </Form>
      <Typography variant="subtitle">
        {t("login.new")} <Link href="create">{t("login.create")}</Link>
      </Typography>
      <Typography variant="subtitle">
        {t("login.forgot")} <Link href="reset">{t("login.reset")}</Link>
      </Typography>
      <Typography variant="subtitle">
        {t("login.missing_verification")}{" "}
        <Link href="resend">{t("login.resend")}</Link>
      </Typography>
      <Show when={clientController.getReadyClients().length > 0}>
        <AccountSwitcher>
          <FlowTitle>Use existing account</FlowTitle>
          <For each={clientController.getReadyClients()}>
            {(client) => (
              <CategoryButton
                icon={<Avatar src={client.user!.avatarURL} size={32} />}
                action="chevron"
                onClick={() => {
                  clientController.switchAccount(client.user!._id);
                  navigate("/");
                }}
              >
                {client.user!.username}
              </CategoryButton>
            )}
          </For>
        </AccountSwitcher>
      </Show>
    </>
  );
}
