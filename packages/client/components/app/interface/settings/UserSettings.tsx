import { Trans } from "@lingui-solid/solid/macro";
import { Server } from "revolt.js";

import { useClient, useClientLifecycle } from "@revolt/client";
import { useUser } from "@revolt/markdown/users";
import { useModals } from "@revolt/modal";
import { ColouredText, Column, iconSize } from "@revolt/ui";

import MdAccountCircle from "@material-design-icons/svg/outlined/account_circle.svg?component-solid";
import _MdDesktopWindows from "@material-design-icons/svg/outlined/desktop_windows.svg?component-solid";
import _MdExtension from "@material-design-icons/svg/outlined/extension.svg?component-solid";
import _MdFormatListBulleted from "@material-design-icons/svg/outlined/format_list_bulleted.svg?component-solid";
import _MdKeybinds from "@material-design-icons/svg/outlined/keyboard.svg?component-solid";
import MdLanguage from "@material-design-icons/svg/outlined/language.svg?component-solid";
import MdLocalCafe from "@material-design-icons/svg/outlined/local_cafe.svg?component-solid";
import MdLogout from "@material-design-icons/svg/outlined/logout.svg?component-solid";
import MdMemory from "@material-design-icons/svg/outlined/memory.svg?component-solid";
import _MdNotifications from "@material-design-icons/svg/outlined/notifications.svg?component-solid";
import MdPalette from "@material-design-icons/svg/outlined/palette.svg?component-solid";
import MdRateReview from "@material-design-icons/svg/outlined/rate_review.svg?component-solid";
import MdScience from "@material-design-icons/svg/outlined/science.svg?component-solid";
import MdSmartToy from "@material-design-icons/svg/outlined/smart_toy.svg?component-solid";
import _MdSpeaker from "@material-design-icons/svg/outlined/speaker.svg?component-solid";
import _MdSync from "@material-design-icons/svg/outlined/sync.svg?component-solid";
import MdVerifiedUser from "@material-design-icons/svg/outlined/verified_user.svg?component-solid";
import MdWorkspacePremium from "@material-design-icons/svg/outlined/workspace_premium.svg?component-solid";

import { SettingsConfiguration } from ".";
import { MyAccount } from "./user/Account";
import { Feedback } from "./user/Feedback";
import { LanguageSettings } from "./user/Language";
import { Sessions } from "./user/Sessions";
import { AccountCard } from "./user/_AccountCard";
import { AppearanceMenu } from "./user/appearance";
import { MyBots, ViewBot } from "./user/bots";
import { EditProfile } from "./user/profile";
import { EditSubscription } from "./user/subscriptions";

const Config: SettingsConfiguration<{ server: Server }> = {
  /**
   * Page titles
   * @param key
   */
  title(ctx, key) {
    if (key.startsWith("bots/")) {
      const user = useUser(key.substring(5));
      return user()!.username;
    }

    return ctx.entries
      .flatMap((category) => category.entries)
      .find((entry) => entry.id === key)?.title as string;
  },

  /**
   * Render the current client settings page
   */
  // we take care of the reactivity ourselves
  /* eslint-disable solid/reactivity */
  /* eslint-disable solid/components-return-once */
  render(props) {
    const id = props.page();
    const client = useClient();

    if (id?.startsWith("bots/")) {
      const bot = client().bots.get(id.substring("bots/".length))!;
      return <ViewBot bot={bot!} />;
    }

    switch (id) {
      case "account":
        return <MyAccount />;
      case "appearance":
        return <AppearanceMenu />;
      case "profile":
        return <EditProfile />;
      case "sessions":
        return <Sessions />;
      case "bots":
        return <MyBots />;
      case "language":
        return <LanguageSettings />;
      case "feedback":
        return <Feedback />;
      case "subscribe":
        return <EditSubscription />;
      default:
        return null;
    }
  },
  /* eslint-enable solid/reactivity */
  /* eslint-enable solid/components-return-once */

  /**
   * Generate list of categories / entries for client settings
   * @returns List
   */
  list() {
    const { pop } = useModals();
    const { logout } = useClientLifecycle();

    return {
      prepend: (
        <Column gap="s">
          <AccountCard />
          <div />
        </Column>
      ),
      entries: [
        {
          title: <Trans>User Settings</Trans>,
          entries: [
            {
              id: "account",
              icon: <></>,
              title: <></>,
              hidden: true,
            },
            {
              id: "profile",
              icon: <MdAccountCircle {...iconSize(20)} />,
              title: <Trans>Profile</Trans>,
            },
            {
              id: "sessions",
              icon: <MdVerifiedUser {...iconSize(20)} />,
              title: <Trans>Sessions</Trans>,
            },
          ],
        },
        {
          title: "Revolt",
          entries: [
            {
              id: "bots",
              icon: <MdSmartToy {...iconSize(20)} />,
              title: <Trans>My Bots</Trans>,
            },
            {
              id: "feedback",
              icon: <MdRateReview {...iconSize(20)} />,
              title: <Trans>Feedback</Trans>,
            },
            {
              href: "https://wiki.revolt.chat/notes/project/financial-support/",
              icon: <MdLocalCafe {...iconSize(20)} />,
              title: <Trans>Donate</Trans>,
            },
          ],
        },
        {
          title: <Trans>Subscriptions</Trans>,
          hidden: import.meta.env.PROD,
          entries: [
            {
              id: "subscribe",
              icon: <MdWorkspacePremium {...iconSize(20)} />,
              title: "[premium]",
            },
          ],
        },
        {
          title: <Trans>Client Settings</Trans>,
          entries: [
            // {
            //   id: "audio",
            //   icon: <MdSpeaker {...iconSize(20)} />,
            //   title: t("app.settings.pages.audio.title"),
            //   hidden:
            //     !getController("state").experiments.isEnabled("voice_chat"),
            // },
            {
              id: "appearance",
              icon: <MdPalette {...iconSize(20)} />,
              title: <Trans>Appearance</Trans>,
            },
            // {
            //   id: "accessibility",
            //   icon: <MdAccessibility {...iconSize(20)} />,
            //   title: t("app.settings.pages.accessibility.title"),
            // },
            // {
            //   id: "plugins",
            //   icon: <MdExtension {...iconSize(20)} />,
            //   title: t("app.settings.pages.plugins.title"),
            //   hidden: !getController("state").experiments.isEnabled("plugins"),
            // },
            // {
            //   id: "notifications",
            //   icon: <MdNotifications {...iconSize(20)} />,
            //   title: t("app.settings.pages.notifications.title"),
            // },
            // {
            //   id: "keybinds",
            //   icon: <MdKeybinds {...iconSize(20)} />,
            //   title: t("app.settings.pages.keybinds.title"),
            // },
            {
              id: "language",
              icon: <MdLanguage {...iconSize(20)} />,
              title: <Trans>Language</Trans>,
            },
            // {
            //   id: "sync",
            //   icon: <MdSync {...iconSize(20)} />,
            //   title: t("app.settings.pages.sync.title"),
            // },
            // {
            //   id: "native",
            //   hidden: false,
            //   icon: <MdDesktopWindows {...iconSize(20)} />,
            //   title: t("app.settings.pages.native.title"),
            // },
            // {
            //   id: "experiments",
            //   icon: <MdScience {...iconSize(20)} />,
            //   title: <Trans>Experiments</Trans>,
            // },
          ],
        },
        {
          entries: [
            // {
            //   onClick: () =>
            //     getController("modal").push({ type: "changelog", posts: [] }),
            //   icon: <MdFormatListBulleted {...iconSize(20)} />,
            //   title: t("app.special.modals.changelogs.title"),
            // },
            {
              href: "https://github.com/revoltchat",
              icon: <MdMemory {...iconSize(20)} />,
              title: <Trans>Source Code</Trans>,
            },
            {
              id: "logout",
              icon: (
                <MdLogout
                  {...iconSize(20)}
                  fill="var(--md-sys-color-error)"
                />
              ),
              title: (
                <ColouredText colour="var(--md-sys-color-error)">
                  <Trans>Log Out</Trans>
                </ColouredText>
              ),
              onClick() {
                pop();
                logout();
              },
            },
          ],
        },
      ],
    };
  },
};

export default Config;
