import { useClient } from "@revolt/client";
import { useTranslation } from "@revolt/i18n";
import { Avatar, Column, Row } from "@revolt/ui";

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
      <Row>
        <Avatar src={client().user!.animatedAvatarURL} size={64} />
        <Column>
          <span>{client().user!.username}</span>
          <span>{t("app.settings.pages.account.title")}</span>
        </Column>
      </Row>
    </SidebarButton>
  );
}
