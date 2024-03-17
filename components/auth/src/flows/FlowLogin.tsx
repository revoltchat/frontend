import { useTranslation } from "@revolt/i18n";
import { Link, useNavigate } from "@revolt/routing";
import { Button, Column, Row, Typography, iconSize, styled } from "@revolt/ui";

import MdArrowBack from "@material-design-icons/svg/filled/arrow_back.svg?component-solid";

import { clientController } from "../../../client";

import { FlowTitle } from "./Flow";
import { Fields, Form } from "./Form";

/**
 * Account switcher UI
 */
// eslint-disable-next-line
const AccountSwitcher = styled(Column)`
  margin-top: 8px;
`;

/**
 * Flow for logging into an account
 */
export default function FlowLogin() {
  const t = useTranslation();
  const navigate = useNavigate();

  /**
   * Log into account
   * @param data Form Data
   */
  async function login(data: FormData) {
    const email = data.get("email") as string;
    const password = data.get("password") as string;

    await clientController.login({
      email,
      password,
    });

    navigate("/app", { replace: true });
  }

  return (
    <>
      {/*<FlowTitle subtitle={t("login.subtitle")} emoji="wave">
        {t("login.welcome")}
      </FlowTitle>*/}
      <strong>
        You are logging into a limited demo of the new Revolt client.
      </strong>

      <span>
        Please provide feedback through{" "}
        <a
          href="https://github.com/revoltchat/frontend/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc"
          target="_blank"
          style={{ "text-decoration": "underline" }}
        >
          GitHub issues
        </a>{" "}
        where possible.
      </span>

      <Form onSubmit={login}>
        <Fields fields={["email", "password"]} />
        <Row align justify="center">
          <Link href="..">
            <Button palette="plain">
              <MdArrowBack {...iconSize("1.2em")} /> Back
            </Button>
          </Link>
          <Button type="submit">{t("login.title")}</Button>
        </Row>
      </Form>

      <a href="https://app.revolt.chat/login/reset" target="_blank">
        {/* <Link href="../reset"> */}
        {t("login.reset")}
        {/* </Link> */}
      </a>
      <a href="https://app.revolt.chat/login/resend" target="_blank">
        {/* <Link href="../resend"> */}
        {t("login.resend")}
        {/* </Link> */}
      </a>

      {/*<Show when={clientController.getReadyClients().length > 0}>
        <Switch fallback={<Navigate href="/" />}>
          <Match when={state.experiments.isEnabled("account_switcher")}>
            <AccountSwitcher>
              <FlowTitle>Use existing account</FlowTitle>
              <For each={clientController.getReadyClients()}>
                {(client) => (
                  <CategoryButton
                    icon={<Avatar src={client.user!.avatarURL} size={32} />}
                    action="chevron"
                    onClick={() => {
                      clientController.switchAccount(client.user!._id);
                      navigate("/app");
                    }}
                  >
                    {client.user!.username}
                  </CategoryButton>
                )}
              </For>
            </AccountSwitcher>
          </Match>
        </Switch>
                  </Show>*/}
    </>
  );
}
