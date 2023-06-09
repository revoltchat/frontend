import {
  BiLogosGithub,
  BiRegularDesktop,
  BiRegularGlobe,
  BiRegularListUl,
  BiRegularSync,
  BiSolidBell,
  BiSolidBot,
  BiSolidCheckShield,
  BiSolidCoffee,
  BiSolidExit,
  BiSolidFlask,
  BiSolidIdCard,
  BiSolidKeyboard,
  BiSolidMegaphone,
  BiSolidPalette,
  BiSolidPlug,
  BiSolidSpeaker,
  BiSolidUser,
} from "solid-icons/bi";
import { Component, Show } from "solid-js";

import { Server } from "revolt.js";

import { getController } from "@revolt/common";
import { useTranslation } from "@revolt/i18n";
import { useUser } from "@revolt/markdown/users";
import { ColouredText, useTheme } from "@revolt/ui";

import { SettingsConfiguration } from "..";

import account from "./Account";
import appearance from "./Appearance";
import bots from "./Bots";
import experiments from "./Experiments";
import feedback from "./Feedback";
import keybinds from "./Keybinds";
import language from "./Language";
import native from "./Native";
import notifications from "./Notifications";
import sessions from "./Sessions";
import sync from "./Sync";

const Config: SettingsConfiguration<{ server: Server }> = {
  /**
   * Page titles
   * @param key
   */
  title(key) {
    const t = useTranslation();

    if (key.startsWith("bots/")) {
      const user = useUser(key.substring(5));
      return user()!.username;
    }

    return t(
      `app.settings.pages.${key.replaceAll("/", ".")}.title`,
      undefined,
      key
    );
  },

  /**
   * Render the current client settings page
   */
  render(props) {
    // eslint-disable-next-line solid/reactivity
    const id = props.page();
    // eslint-disable-next-line solid/components-return-once
    if (!id) return null;

    const Component = ClientSettingsRouting[id];
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
    const t = useTranslation();
    const theme = useTheme();

    return [
      {
        title: t("app.settings.categories.user_settings"),
        entries: [
          {
            id: "account",
            icon: <BiSolidUser size={20} />,
            title: t("app.settings.pages.account.title"),
          },
          {
            id: "profile",
            icon: <BiSolidIdCard size={20} />,
            title: t("app.settings.pages.profile.title"),
          },
          {
            id: "sessions",
            icon: <BiSolidCheckShield size={20} />,
            title: t("app.settings.pages.sessions.title"),
          },
        ],
      },
      {
        title: <div>Revolt</div>,
        entries: [
          {
            id: "bots",
            icon: <BiSolidBot size={20} />,
            title: t("app.settings.pages.bots.title"),
          },
          {
            id: "feedback",
            icon: <BiSolidMegaphone size={20} />,
            title: t("app.settings.pages.feedback.title"),
          },
          {
            href: "https://insrt.uk/donate",
            icon: <BiSolidCoffee size={20} color="rgba(255,155,0,1)" />,
            title: (
              <ColouredText
                clip
                colour="linear-gradient(-132deg, rgba(233,189,173,1) 1%, rgba(232,196,180,1) 3%, rgba(255,155,0,1) 100%)"
              >
                {t("app.settings.pages.donate.title")}
              </ColouredText>
            ),
          },
        ],
      },
      {
        title: t("app.settings.categories.client_settings"),
        entries: [
          {
            id: "audio",
            icon: <BiSolidSpeaker size={20} />,
            title: t("app.settings.pages.audio.title"),
            hidden: !getController("state").experiments.isEnabled("voice_chat"),
          },
          {
            id: "appearance",
            icon: <BiSolidPalette size={20} />,
            title: t("app.settings.pages.appearance.title"),
          },
          {
            id: "plugins",
            icon: <BiSolidPlug size={20} />,
            title: t("app.settings.pages.plugins.title"),
            hidden: !getController("state").experiments.isEnabled("plugins"),
          },
          {
            id: "notifications",
            icon: <BiSolidBell size={20} />,
            title: t("app.settings.pages.notifications.title"),
          },
          {
            id: "keybinds",
            icon: <BiSolidKeyboard size={20} />,
            title: t("app.settings.pages.keybinds.title"),
          },
          {
            id: "language",
            icon: <BiRegularGlobe size={20} />,
            title: t("app.settings.pages.language.title"),
          },
          {
            id: "sync",
            icon: <BiRegularSync size={20} />,
            title: t("app.settings.pages.sync.title"),
          },
          {
            id: "native",
            hidden: false,
            icon: <BiRegularDesktop size={20} />,
            title: t("app.settings.pages.native.title"),
          },
          {
            id: "experiments",
            icon: <BiSolidFlask size={20} />,
            title: t("app.settings.pages.experiments.title"),
          },
        ],
      },
      {
        entries: [
          {
            onClick: () =>
              getController("modal").push({ type: "changelog", posts: [] }),
            icon: <BiRegularListUl size={20} />,
            title: t("app.special.modals.changelogs.title"),
          },
          {
            href: "https://github.com/revoltchat",
            icon: <BiLogosGithub size={20} />,
            title: t("app.settings.pages.source_code"),
          },
          {
            id: "logout",
            icon: <BiSolidExit size={20} color={theme!.colours.error} />,
            title: (
              <ColouredText colour={theme!.colours.error}>
                {t("app.settings.pages.logOut")}
              </ColouredText>
            ),
          },
        ],
      },
    ];
  },
};

export default Config;

/**
 * All the available routes for client settings
 */
const ClientSettingsRouting: Record<string, Component> = {
  account,
  profile: () => null,
  sessions,
  bots,
  feedback,
  audio: () => null,
  appearance,
  "appearance/colours": () => <h1>hi</h1>,
  notifications,
  language,
  sync,
  native,
  experiments,
  keybinds,
};
