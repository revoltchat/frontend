import { useClient } from "@revolt/client";
import { useTranslation } from "@revolt/i18n";
import { Avatar, OverflowingText, Typography } from "@revolt/ui";

// import MdError from "@material-design-icons/svg/filled/error.svg?component-solid";
import { useSettingsNavigation } from "../Settings";
import {
  SidebarButton,
  SidebarButtonContent,
  SidebarButtonTitle,
} from "../_layout/SidebarButton";

/**
 * Account Card
 */
export function AccountCard() {
  const client = useClient();
  const t = useTranslation();
  const { navigate } = useSettingsNavigation();
  // const theme = useTheme();

  return (
    <SidebarButton onClick={() => navigate("account")}>
      <SidebarButtonTitle>
        <Avatar size={36} src={client().user!.animatedAvatarURL} />
        <SidebarButtonContent>
          <OverflowingText>
            <Typography variant="settings-account-card-title">
              {client().user!.username}
            </Typography>
          </OverflowingText>
          <Typography variant="settings-account-card-subtitle">
            {t("app.settings.pages.account.title")}
          </Typography>
        </SidebarButtonContent>
      </SidebarButtonTitle>
      {/*<SidebarButtonIcon>
        <MdError {...iconSize(20)} fill={theme!.colour("primary")} />
      </SidebarButtonIcon>*/}
    </SidebarButton>
  );
}
