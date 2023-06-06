import {
  BiRegularAt,
  BiRegularBlock,
  BiRegularKey,
  BiRegularMailSend,
  BiSolidInfoCircle,
  BiSolidLock,
  BiSolidShield,
  BiSolidTrash,
} from "solid-icons/bi";
import { Accessor, Match, Show, Switch, createSignal, onMount } from "solid-js";

import { MFA } from "revolt.js/src/classes/MFA";

import { useClient } from "@revolt/client";
import { getController } from "@revolt/common";
import { useTranslation } from "@revolt/i18n";
import {
  Avatar,
  CategoryButton,
  CategoryButtonGroup,
  CategoryCollapse,
  Column,
  Row,
  Typography,
  styled,
  useTheme,
} from "@revolt/ui";

/**
 * Account Page
 */
export default function MyAccount() {
  const client = useClient();

  const [mfa, setMfa] = createSignal<MFA>();
  onMount(() => client().account.mfa().then(setMfa));

  return (
    <Column gap="xl">
      <UserInformation />
      <EditAccount />
      <MultiFactorAuth mfa={mfa} />
      <ManageAccount mfa={mfa} />
    </Column>
  );
}

/**
 * User Information
 */
function UserInformation() {
  const client = useClient();

  return (
    <Row align>
      <Avatar src={client().user?.animatedAvatarURL} size={64} />
      <Column gap="xs">
        <Typography variant="username">{client().user?.username}</Typography>
        <Typography variant="label">
          <UserId align gap="xs">
            <BiSolidInfoCircle /> {client().user?.id}
          </UserId>
        </Typography>
      </Column>
    </Row>
  );
}

/**
 * User ID styling
 */
const UserId = styled(Row)`
  color: ${(props) => props.theme!.scheme.onBackground};
`;

/**
 * Edit account details
 */
function EditAccount() {
  const t = useTranslation();
  const client = useClient();
  const [email, setEmail] = createSignal("•••••••••••@•••••••••••");

  return (
    <CategoryButtonGroup>
      <CategoryButton
        action="chevron"
        onClick={() =>
          getController("modal").push({
            type: "edit_username",
            client: client(),
          })
        }
        icon={<BiRegularAt size={24} />}
        description={client().user?.username}
      >
        <Typography variant="label">{t("login.username")}</Typography>
      </CategoryButton>
      <CategoryButton
        action="chevron"
        onClick={() =>
          getController("modal").push({
            type: "edit_email",
            client: client(),
          })
        }
        icon={<BiRegularMailSend size={24} />}
        description={
          <Row>
            {email()}{" "}
            <Show when={email().startsWith("•")}>
              <a
                onClick={(event) => {
                  event.stopPropagation();
                  client().account.fetchEmail().then(setEmail);
                }}
              >
                Reveal
              </a>
            </Show>
          </Row>
        }
      >
        <Typography variant="label">{t("login.email")}</Typography>
      </CategoryButton>
      <CategoryButton
        action="chevron"
        onClick={() =>
          getController("modal").push({
            type: "edit_password",
            client: client(),
          })
        }
        icon={<BiRegularKey size={24} />}
        description={"•••••••••"}
      >
        <Typography variant="label">{t("login.password")}</Typography>
      </CategoryButton>
    </CategoryButtonGroup>
  );
}

/**
 * Multi-factor authentication
 */
function MultiFactorAuth(props: { mfa: Accessor<MFA | undefined> }) {
  const client = useClient();

  /**
   * Show recovery codes
   */
  async function showRecoveryCodes() {
    const mfa = props.mfa()!;
    const modals = getController("modal");
    const ticket = await modals.mfaFlow(mfa);

    ticket!.fetchRecoveryCodes().then((codes) =>
      getController("modal").push({
        type: "mfa_recovery",
        mfa,
        codes,
      })
    );
  }

  /**
   * Generate recovery codes
   */
  async function generateRecoveryCodes() {
    const mfa = props.mfa()!;
    const modals = getController("modal");
    const ticket = await modals.mfaFlow(mfa);

    ticket!.generateRecoveryCodes().then((codes) =>
      getController("modal").push({
        type: "mfa_recovery",
        mfa,
        codes,
      })
    );
  }

  /**
   * Configure authenticator app
   */
  async function setupAuthenticatorApp() {
    const mfa = props.mfa()!;
    const modals = getController("modal");
    const ticket = await modals.mfaFlow(mfa);
    const secret = await ticket!.generateAuthenticatorSecret();

    let success;
    while (!success) {
      try {
        const code = await modals.mfaEnableTOTP(
          secret,
          client().user!.username
        );

        if (code) {
          await mfa.enableAuthenticator(code);
          success = true;
        }
      } catch (err) {
        /* no-op */
      }
    }
  }

  /**
   * Disable authenticator app
   */
  function disableAuthenticatorApp() {
    getController("modal")
      .mfaFlow(props.mfa()!)
      .then((ticket) => ticket!.disableAuthenticator());
  }

  return (
    <CategoryButtonGroup>
      <CategoryCollapse
        icon={<BiSolidShield size={24} />}
        title="Recovery Codes"
        description="Configure a way to get back into your account in case your 2FA is lost"
      >
        <Switch
          fallback={
            <CategoryButton
              icon="blank"
              disabled={!props.mfa()}
              onClick={generateRecoveryCodes}
              description="Setup recovery codes"
            >
              Generate Recovery Codes
            </CategoryButton>
          }
        >
          <Match when={props.mfa()?.recoveryEnabled}>
            <CategoryButton
              icon="blank"
              description="Get active recovery codes"
              onClick={showRecoveryCodes}
            >
              View Recovery Codes
            </CategoryButton>
            <CategoryButton
              icon="blank"
              description="Get a new set of recovery codes"
              onClick={generateRecoveryCodes}
            >
              Reset Recovery Codes
            </CategoryButton>
          </Match>
        </Switch>
      </CategoryCollapse>
      <CategoryCollapse
        icon={<BiSolidLock size={24} />}
        title="Authenticator App"
        description="Configure one-time password authentication"
      >
        <Switch
          fallback={
            <CategoryButton
              icon="blank"
              disabled={!props.mfa()}
              onClick={setupAuthenticatorApp}
              description="Setup one-time password authenticator"
            >
              Enable Authenticator
            </CategoryButton>
          }
        >
          <Match when={props.mfa()?.authenticatorEnabled}>
            <CategoryButton
              icon="blank"
              description="Disable one-time password authenticator"
              onClick={disableAuthenticatorApp}
            >
              Remove Authenticator
            </CategoryButton>
          </Match>
        </Switch>
      </CategoryCollapse>
    </CategoryButtonGroup>
  );
}

/**
 * Manage account
 */
function ManageAccount(props: { mfa: Accessor<MFA | undefined> }) {
  const theme = useTheme();
  const t = useTranslation();

  /**
   * Disable account
   */
  function disableAccount() {
    const mfa = props.mfa()!;
    getController("modal")
      .mfaFlow(mfa)
      .then((ticket) =>
        ticket!.disableAccount().then(() => {
          /** TODO: log out logic */
        })
      );
  }

  /**
   * Delete account
   */
  function deleteAccount() {
    const mfa = props.mfa()!;
    getController("modal")
      .mfaFlow(mfa)
      .then((ticket) =>
        ticket!.deleteAccount().then(() => {
          /** TODO: log out logic */
        })
      );
  }

  return (
    <CategoryButtonGroup>
      <CategoryButton
        action="chevron"
        disabled={!props.mfa()}
        onClick={disableAccount}
        icon={<BiRegularBlock size={24} color={theme.scheme.error} />}
        description="Disable your account. You won't be able to access it unless you contact support."
      >
        {t("app.settings.pages.account.manage.disable")}
      </CategoryButton>
      <CategoryButton
        action="chevron"
        disabled={!props.mfa()}
        onClick={deleteAccount}
        icon={<BiSolidTrash size={24} color={theme.scheme.error} />}
        description="Your account will be queued for deletion, a confirmation email will be sent."
      >
        {t("app.settings.pages.account.manage.delete")}
      </CategoryButton>
    </CategoryButtonGroup>
  );
}
