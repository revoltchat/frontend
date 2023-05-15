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

import { useClient } from "@revolt/client";
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
          onClick={() => void 0}
          icon={<BiRegularAt size={24} />}
          description={client().user?.username}
        >
          <Typography variant="label">Username</Typography>
        </CategoryButton>
        <CategoryButton
          action="edit"
          onClick={() => void 0}
          icon={<BiRegularMailSend size={24} />}
          description={"•••••••••••@••••••.•••"}
        >
          <Typography variant="label">Email</Typography>
        </CategoryButton>
        <CategoryButton
          action="edit"
          onClick={() => void 0}
          icon={<BiRegularKey size={24} />}
          description={"•••••••••"}
        >
          <Typography variant="label">Password</Typography>
        </CategoryButton>
      </Column>
      <Column>
        <Typography variant="label">Two-Factor Authentication</Typography>
        <CategoryCollapse
          icon={<BiSolidShield size={24} />}
          title="Recovery Codes"
          description="Configure a way to get back into your account in case your 2FA is lost"
        >
          <CategoryButton
            icon="blank"
            description="Get a new set of recovery codes"
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
          >
            Remove Authenticator
          </CategoryButton>
        </CategoryCollapse>
      </Column>
      <Column>
        <Typography variant="label">Account Management</Typography>
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
