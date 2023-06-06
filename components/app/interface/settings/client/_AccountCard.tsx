import { useClient } from "@revolt/client";
import { useTranslation } from "@revolt/i18n";
import { Avatar, Column, Row, styled } from "@revolt/ui";


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
        <Card>
          <Avatar src={client().user!.animatedAvatarURL} size={40} />
          <div class="details">
            <div>{client().user!.username}</div>
            <span>{t("app.settings.pages.account.title")}</span>
          </div>
        </Card>
      </Row>
    </SidebarButton>
  );
}

export const Card = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;

  .details div {
    font-weight: 600;
  }

  > div span {
    font-size: 12px;
  }
`;