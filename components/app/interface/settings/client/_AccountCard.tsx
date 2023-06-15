import { useClient } from "@revolt/client";
import { useTranslation } from "@revolt/i18n";
import { Avatar, Column, Row, Typography, useTheme, iconSize } from "@revolt/ui";
import { useSettingsNavigation } from "../Settings";
import { SidebarButton } from "../_layout/SidebarButton";

import MdError from "@material-design-icons/svg/filled/error.svg?component-solid";

/**
 * Account Card
 */
export function AccountCard() {
  const client = useClient();
  const t = useTranslation();
  const { navigate } = useSettingsNavigation();
  const theme = useTheme();

  return (
    <SidebarButton onClick={() => navigate("account")}>
      <Row align gap="md">
        <Avatar src={client().user!.animatedAvatarURL} size={36} />
        <Column gap="xs">
          <Typography variant="settings-account-card-title">
            {client().user!.username}
          </Typography>
          <Typography variant="settings-account-card-subtitle">
            {t("app.settings.pages.account.title")}
          </Typography>
        </Column>
        <MdError {...iconSize(20)} fill={theme!.colour("primary")} />
      </Row>
    </SidebarButton>
  );
}
