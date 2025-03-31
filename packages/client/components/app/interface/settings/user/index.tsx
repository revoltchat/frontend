import { Component, Show } from "solid-js";

import { Server } from "revolt.js";

import { getController } from "@revolt/common";
import { useUser } from "@revolt/markdown/users";
import { ColouredText, Column, iconSize } from "@revolt/ui";
import { ColourSwatches } from "@revolt/ui/components/design/atoms/inputs/ColourSwatches";

// Filled Icons
import MdAccountCircleFill from "@material-design-icons/svg/filled/account_circle.svg?component-solid";
import MdDesktopWindowsFill from "@material-design-icons/svg/filled/desktop_windows.svg?component-solid";
import MdExtensionFill from "@material-design-icons/svg/filled/extension.svg?component-solid";
import MdFormatListBulletedFill from "@material-design-icons/svg/filled/format_list_bulleted.svg?component-solid";
import MdLanguageFill from "@material-design-icons/svg/filled/language.svg?component-solid";
import MdLocalCafeFill from "@material-design-icons/svg/filled/local_cafe.svg?component-solid";
import MdLogoutFill from "@material-design-icons/svg/filled/logout.svg?component-solid";
import MdMemoryFill from "@material-design-icons/svg/filled/memory.svg?component-solid";
import MdNotificationsFill from "@material-design-icons/svg/filled/notifications.svg?component-solid";
import MdPaletteFill from "@material-design-icons/svg/filled/palette.svg?component-solid";
import MdRateReviewFill from "@material-design-icons/svg/filled/rate_review.svg?component-solid";
import MdScienceFill from "@material-design-icons/svg/filled/science.svg?component-solid";
import MdSmartToyFill from "@material-design-icons/svg/filled/smart_toy.svg?component-solid";
import MdSpeakerFill from "@material-design-icons/svg/filled/speaker.svg?component-solid";
import MdSyncFill from "@material-design-icons/svg/filled/sync.svg?component-solid";
import MdVerifiedUserFill from "@material-design-icons/svg/filled/verified_user.svg?component-solid";
import MdAccessibility from "@material-design-icons/svg/outlined/accessibility.svg?component-solid";
// Outlined Icons
import MdAccountCircle from "@material-design-icons/svg/outlined/account_circle.svg?component-solid";
import MdDesktopWindows from "@material-design-icons/svg/outlined/desktop_windows.svg?component-solid";
import MdExtension from "@material-design-icons/svg/outlined/extension.svg?component-solid";
import MdFormatListBulleted from "@material-design-icons/svg/outlined/format_list_bulleted.svg?component-solid";
import MdKeybinds from "@material-design-icons/svg/outlined/keyboard.svg?component-solid";
import MdLanguage from "@material-design-icons/svg/outlined/language.svg?component-solid";
import MdLocalCafe from "@material-design-icons/svg/outlined/local_cafe.svg?component-solid";
import MdLogout from "@material-design-icons/svg/outlined/logout.svg?component-solid";
import MdMemory from "@material-design-icons/svg/outlined/memory.svg?component-solid";
import MdNotifications from "@material-design-icons/svg/outlined/notifications.svg?component-solid";
import MdPalette from "@material-design-icons/svg/outlined/palette.svg?component-solid";
import MdRateReview from "@material-design-icons/svg/outlined/rate_review.svg?component-solid";
import MdScience from "@material-design-icons/svg/outlined/science.svg?component-solid";
import MdSmartToy from "@material-design-icons/svg/outlined/smart_toy.svg?component-solid";
import MdSpeaker from "@material-design-icons/svg/outlined/speaker.svg?component-solid";
import MdSync from "@material-design-icons/svg/outlined/sync.svg?component-solid";
import MdVerifiedUser from "@material-design-icons/svg/outlined/verified_user.svg?component-solid";

import { SettingsConfiguration } from "..";

import accessibility from "./Accessibility";
import account from "./Account";
import appearance from "./Appearance";
import experiments from "./Experiments";
import feedback from "./Feedback";
import keybinds from "./Keybinds";
import language from "./Language";
import native from "./Native";
import notifications from "./Notifications";
import sessions from "./Sessions";
import sync from "./Sync";
import { AccountCard } from "./_AccountCard";
import { MyBots, ViewBot } from "./bots";
import { EditProfile } from "./profile";
import { Trans } from "@lingui-solid/solid/macro";

/**
 * All the available routes for client settings
 */
const ClientSettingsRouting: Record<string, Component> = {
  account,
  profile: EditProfile,
  sessions,

  // Bots
  bots: MyBots,
  "bots/view": ViewBot,

  feedback,
  audio: () => null,
  appearance,
  "appearance/colours": () => <ColourSwatches />,
  accessibility,
  notifications,
  language,
  sync,
  native,
  experiments,
  keybinds,
};

/**
 * Map the page key to component
 * @param id Id
 * @returns New Id
 */
function mapRoutingId(id: string) {
  if (id.startsWith("bots/")) {
    return "bots/view";
  }

  return id;
}

const Config: SettingsConfiguration<{ server: Server }> = {
  /**
   * Page titles
   * @param key
   */
  title(key) {
    if (key.startsWith("bots/")) {
      const user = useUser(key.substring(5));
      return user()!.username;
    }

    return "todo " + key;
  },

  /**
   * Render the current client settings page
   */
  render(props) {
    // eslint-disable-next-line solid/reactivity
    const id = props.page();
    // eslint-disable-next-line solid/components-return-once
    if (!id) return null;

    const Component = ClientSettingsRouting[mapRoutingId(id)];
    return (
      <Show when={Component}>
        <Component />
      </Show>
    );
  },

  /**
   * Generate list of categories / entries for client settings
   * @returns List
   */
  list() {
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
          title: <Trans>Client Settings</Trans>,
          entries: [
            // {
            //   id: "audio",
            //   icon: <MdSpeaker {...iconSize(20)} />,
            //   title: t("app.settings.pages.audio.title"),
            //   hidden:
            //     !getController("state").experiments.isEnabled("voice_chat"),
            // },
            // {
            //   id: "appearance",
            //   icon: <MdPalette {...iconSize(20)} />,
            //   title: t("app.settings.pages.appearance.title"),
            // },
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
            {
              id: "experiments",
              icon: <MdScience {...iconSize(20)} />,
              title: <Trans>Experiments</Trans>,
            },
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
                  fill="var(--customColours-error-color)"
                />
              ),
              title: (
                <ColouredText colour="var(--customColours-error-color)">
                  <Trans>Log Out</Trans>
                </ColouredText>
              ),
              onClick: () => {
                getController("modal").pop();
                getController("client").logout();
              },
            },
          ],
        },
      ],
    };
  },
};

export default Config;
