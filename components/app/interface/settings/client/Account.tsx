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
  Chip,
  Column,
  Row,
  Time,
  Tooltip,
  Typography,
  styled,
  useTheme,
  iconSize,
} from "@revolt/ui";
import { formatTime } from "@revolt/ui/components/design/atoms/display/Time";

import MdCakeFill from "@material-design-icons/svg/filled/cake.svg?component-solid";
import MdAlternateEmail from "@material-design-icons/svg/outlined/alternate_email.svg?component-solid";
import MdMail from "@material-design-icons/svg/outlined/mail.svg?component-solid";
import MdPassword from "@material-design-icons/svg/outlined/password.svg?component-solid";
import MdVerifiedUser from "@material-design-icons/svg/outlined/verified_user.svg?component-solid";
import MdLock from "@material-design-icons/svg/outlined/lock.svg?component-solid";
import MdBlock from "@material-design-icons/svg/outlined/block.svg?component-solid";
import MdDelete from "@material-design-icons/svg/outlined/delete.svg?component-solid";

/**
 * Account Page
 */
export default function MyAccount() {
  const client = useClient();

  const [mfa, setMfa] = createSignal<MFA>();
  onMount(() => client().account.mfa().then(setMfa));

  return (
    <Column gap="lg">
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
    <AccountBox align gap="lg">
      <Avatar src={client().user!.animatedAvatarURL} size={64} />
      <div class="column">
        <Typography variant="settings-account-username">
          {client().user!.username}#0000
        </Typography>
        <div class="flex">
          <Tooltip
            content={formatTime({
              format: "datetime",
              value: client().user!.createdAt,
            })}
            placement="top"
          >
            <Chip>
              <MdCakeFill {...iconSize(14)} /> Account created{" "}
              <Time format="relative" value={client().user!.createdAt} />
            </Chip>
          </Tooltip>
        </div>
      </div>
      <div class='button'>
        Edit Profile
      </div>
    </AccountBox>
  );
}

/**
 * Styles for the account box
 */
const AccountBox = styled(Row)`
  padding: ${(props) => props.theme!.gap.lg};
  border-radius: ${(props) => props.theme!.borderRadius.xl};
  background: ${(props) => props.theme!.colour("background")};

  .column {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex-grow: 1;
  }

  .flex {
    display: flex;
  }
  
  .button {
    color: ${(props) => props.theme!.colour("onSecondary")};
    padding: 10px 16px;
    border-radius: 60px;
    font-size: 14px;
    font-weight: 500;
    background: ${(props) => props.theme!.colour("primary")};
  }
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
        icon={<MdAlternateEmail {...iconSize(24)} />}
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
        icon={<MdMail {...iconSize(24)} />}
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
        icon={<MdPassword {...iconSize(24)} />}
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
        icon={<MdVerifiedUser {...iconSize(24)} />}
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
        icon={<MdLock {...iconSize(24)} />}
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
        icon={<MdBlock {...iconSize(24)} fill={theme!.colour("error")} />}
        description="Disable your account. You won't be able to access it unless you contact support."
      >
        {t("app.settings.pages.account.manage.disable")}
      </CategoryButton>
      <CategoryButton
        action="chevron"
        disabled={!props.mfa()}
        onClick={deleteAccount}
        icon={<MdDelete {...iconSize(24)} fill={theme!.colour("error")} />}
        description="Your account will be queued for deletion, a confirmation email will be sent."
      >
        {t("app.settings.pages.account.manage.delete")}
      </CategoryButton>
    </CategoryButtonGroup>
  );
}
