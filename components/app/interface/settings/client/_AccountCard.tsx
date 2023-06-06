import { useClient } from "@revolt/client";
import { useTranslation } from "@revolt/i18n";
import { Avatar, Column, Row, Typography } from "@revolt/ui";

import { useSettingsNavigation } from "../Settings";
import { SidebarButton } from "../_layout/SidebarButton";

/**
 * Account Card
 */
export function AccountCard() {
  const client = useClient();
  const t = useTranslation();
  const { navigate } = useSettingsNavigation();

  return (
    <SidebarButton onClick={() => navigate("account")}>
      <Row align gap="md">
        <Avatar src={client().user!.animatedAvatarURL} size={40} />
        <Column gap="xs">
          <Typography variant="settings-account-card-title">
            {client().user!.username}
          </Typography>
          <Typography variant="settings-account-card-subtitle">
            {t("app.settings.pages.account.title")}
          </Typography>
        </Column>
      </Row>
    </SidebarButton>
  );
}
