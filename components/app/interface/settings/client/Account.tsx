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
import { Show, createSignal } from "solid-js";

import { useClient } from "@revolt/client";
import { getController } from "@revolt/common";
import { useTranslation } from "@revolt/i18n";
import {
  Avatar,
  CategoryButton,
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
  const t = useTranslation();
  const theme = useTheme();
  const [email, setEmail] = createSignal("•••••••••••@••••••.•••");

  return (
    <Column gap="xl">
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

      <Column>
        <CategoryButton
          action="edit"
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
          action="edit"
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
          action="edit"
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
      </Column>

      <Column>
        <Typography variant="label">
          {t("app.settings.pages.account.2fa.title")}
        </Typography>
        <CategoryCollapse
          icon={<BiSolidShield size={24} />}
          title="Recovery Codes"
          description="Configure a way to get back into your account in case your 2FA is lost"
        >
          <CategoryButton
            icon="blank"
            description="Get active recovery codes"
            onClick={() => void 0}
          >
            View Recovery Codes
          </CategoryButton>
          <CategoryButton
            icon="blank"
            description="Get a new set of recovery codes"
            onClick={() => void 0}
          >
            Reset Recovery Codes
          </CategoryButton>
        </CategoryCollapse>
        <CategoryCollapse
          icon={<BiSolidLock size={24} />}
          title="Authenticator App"
          description="Configure one-time password authentication"
        >
          <CategoryButton
            icon="blank"
            description="Disable one-time password authenticator"
            onClick={() => void 0}
          >
            Remove Authenticator
          </CategoryButton>
        </CategoryCollapse>
      </Column>

      <Column>
        <Typography variant="label">
          {t("app.settings.pages.account.manage.title")}
        </Typography>
        <CategoryButton
          action="chevron"
          onClick={() => void 0}
          icon={<BiRegularBlock size={24} color={theme.colours.error} />}
          description="Disable your account. You won't be able to access it unless you contact support."
        >
          {t("app.settings.pages.account.manage.disable")}
        </CategoryButton>
        <CategoryButton
          action="chevron"
          onClick={() => void 0}
          icon={<BiSolidTrash size={24} color={theme.colours.error} />}
          description="Your account will be queued for deletion, a confirmation email will be sent."
        >
          {t("app.settings.pages.account.manage.delete")}
        </CategoryButton>
      </Column>
    </Column>
  );
}

const UserId = styled(Row)`
  color: ${(props) => props.theme?.colours["foreground-300"]};
`;
