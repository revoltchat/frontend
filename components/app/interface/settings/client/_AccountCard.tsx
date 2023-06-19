import { useClient } from "@revolt/client";
import { useTranslation } from "@revolt/i18n";
import { Avatar, Typography, styled, useTheme, iconSize } from "@revolt/ui";
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
    <SidebarAccountCard onClick={() => navigate("account")}>
      <div class="title">
        <Avatar src={client().user!.animatedAvatarURL} size={36} />
        <div class="text">
          <Typography variant="settings-account-card-title">
            {client().user!.username}
          </Typography>
          <Typography variant="settings-account-card-subtitle">
            {t("app.settings.pages.account.title")}
          </Typography>
        </div>
      </div>
      <div class="icon">
        <MdError {...iconSize(20)} fill={theme!.colour("primary")} />
        <MdError {...iconSize(20)} fill={theme!.colour("primary")} />
      </div>
    </SidebarAccountCard>
  );
}

const SidebarAccountCard = styled(SidebarButton)`
  .title {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-grow: 1;
    padding-inline-end: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    
    .text {
      display: flex;
      flex-direction: column;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .icon {
    display: flex;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex-shrink: 0;
    gap: 2px;
  }
`;