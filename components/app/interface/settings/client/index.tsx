import {
  BiLogosGithub,
  BiRegularCheck,
  BiRegularCodeCurly,
  BiRegularDesktop,
  BiRegularGlobe,
  BiRegularListUl,
  BiRegularSync,
  BiRegularText,
  BiSolidBell,
  BiSolidBot,
  BiSolidBrush,
  BiSolidCheckShield,
  BiSolidCoffee,
  BiSolidError,
  BiSolidExit,
  BiSolidFlask,
  BiSolidHappyBeaming,
  BiSolidIdCard,
  BiSolidMegaphone,
  BiSolidPalette,
  BiSolidPlug,
  BiSolidSpeaker,
  BiSolidUser,
} from "solid-icons/bi";
import { Accessor, Component, For, Show, createMemo } from "solid-js";

import { useClient } from "@revolt/client";
import { getController } from "@revolt/common";
import {
  Languages,
  browserPreferredLanguage,
  language,
  loadAndSetLanguage,
  useTranslation,
} from "@revolt/i18n";
import { UnicodeEmoji } from "@revolt/markdown/emoji";
import { state } from "@revolt/state";
import {
  AVAILABLE_EXPERIMENTS,
  EXPERIMENTS,
} from "@revolt/state/stores/Experiments";
import {
  Avatar,
  CategoryButton,
  Checkbox,
  ColouredText,
  Column,
  Row,
  Typography,
  useTheme,
} from "@revolt/ui";

import { SettingsList, useSettingsNavigation } from "../Settings";

/**
 * Generate list of categories / entries for client settings
 * @returns List
 */
export const clientSettingsList = () => {
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
  ] as SettingsList;
};

/**
 * All the available routes for client settings
 */
export const ClientSettingsRouting: Record<string, Component> = {
  account: () => {
    const client = useClient();
    return (
      <Column>
        <Row align>
          <Avatar src={client().user?.animatedAvatarURL} size={64} />
          <Column gap="sm">
            <Typography variant="username">
              {client().user?.username}
            </Typography>
            <span>{client().user?.id}</span>
          </Column>
        </Row>
      </Column>
    );
  },
  profile: () => null,
  sessions: () => null,
  bots: () => null,
  feedback: () => null,
  audio: () => null,
  appearance: () => {
    const { navigate } = useSettingsNavigation();
    return (
      <Column>
        <img
          src="https://app.revolt.chat/assets/dark.f38e16a0.svg"
          width="360px"
        />
        <CategoryButton
          action="chevron"
          icon={<BiSolidPalette size={32} />}
          onClick={() => navigate("appearance/colours")}
          description="Customise accent colour, additional colours, and transparency"
        >
          Colours
        </CategoryButton>
        <CategoryButton
          action="chevron"
          icon={<BiSolidHappyBeaming size={32} />}
          onClick={() => navigate("appearance/emoji")}
          description="Change how your emojis look"
        >
          Emoji
        </CategoryButton>
        <CategoryButton
          action="chevron"
          icon={<BiRegularText size={32} />}
          onClick={() => navigate("appearance/fonts")}
          description="Customise font and text display"
        >
          Fonts
        </CategoryButton>
        <CategoryButton
          action="chevron"
          icon={<BiRegularCodeCurly size={32} />}
          onClick={() => navigate("appearance/advanced_options")}
          description="Customise theme variables and apply custom CSS"
        >
          Advanced Options
        </CategoryButton>
        <CategoryButton
          action="external"
          icon={<BiSolidBrush size={32} />}
          description="Browse themes made by the community"
        >
          Discover themes
        </CategoryButton>
      </Column>
    );
  },
  "appearance/colours": () => <h1>hi</h1>,
  notifications: () => null,
  language: () => {
    const t = useTranslation();

    // Generate languages array.
    const languages = createMemo(() => {
      const languages = Object.keys(Languages).map(
        (x) => [x, Languages[x as keyof typeof Languages]] as const
      );

      const preferredLanguage = browserPreferredLanguage();

      if (preferredLanguage) {
        // This moves the user's system language to the top of the language list
        const prefLangKey = languages.find(
          (lang) => lang[0].replace(/_/g, "-") == preferredLanguage
        );

        if (prefLangKey) {
          languages.splice(
            0,
            0,
            languages.splice(languages.indexOf(prefLangKey), 1)[0]
          );
        }
      }

      return languages;
    });

    return (
      <Column>
        <Typography variant="legacy-modal-title-2">
          {t("app.settings.pages.language.select")}
        </Typography>
        <For each={languages().filter(([, lang]) => !lang.cat)}>
          {([id, lang]) => (
            <Checkbox
              value={id === language()}
              onClick={() => loadAndSetLanguage(id as never)}
              title={
                <Row>
                  <UnicodeEmoji emoji={lang.emoji} />
                  {lang.display} {lang.verified && <BiRegularCheck size={16} />}{" "}
                  {lang.incomplete && <BiSolidError size={16} />}
                </Row>
              }
            />
          )}
        </For>

        <Typography variant="legacy-modal-title-2">
          {t("app.settings.pages.language.const")}
        </Typography>
        <For each={languages().filter(([, lang]) => lang.cat === "const")}>
          {([id, lang]) => (
            <Checkbox
              value={id === language()}
              onClick={() => loadAndSetLanguage(id as never)}
              title={
                <Row>
                  <UnicodeEmoji emoji={lang.emoji} />
                  {lang.display} {lang.verified && <BiRegularCheck size={16} />}{" "}
                  {lang.incomplete && <BiSolidError size={16} />}
                </Row>
              }
            />
          )}
        </For>

        <Typography variant="legacy-modal-title-2">
          {t("app.settings.pages.language.other")}
        </Typography>
        <For each={languages().filter(([, lang]) => lang.cat === "alt")}>
          {([id, lang]) => (
            <Checkbox
              value={id === language()}
              onClick={() => loadAndSetLanguage(id as never)}
              title={
                <Row>
                  <UnicodeEmoji emoji={lang.emoji} />
                  {lang.display} {lang.verified && <BiRegularCheck size={16} />}{" "}
                  {lang.incomplete && <BiSolidError size={16} />}
                </Row>
              }
            />
          )}
        </For>
      </Column>
    );
  },
  sync: () => null,
  native: () => null,
  experiments: () => {
    return (
      <Column>
        <For each={AVAILABLE_EXPERIMENTS}>
          {(key) => (
            <Checkbox
              value={state.experiments.isEnabled(key)}
              onChange={(enabled) => state.experiments.setEnabled(key, enabled)}
              title={EXPERIMENTS[key].title}
              description={EXPERIMENTS[key].description}
            />
          )}
        </For>
      </Column>
    );
  },
};

/**
 * Page titles
 * @param key
 */
export const clientSettingsTitle = (key: string) => {
  const t = useTranslation();
  return t(`app.settings.pages.${key.replaceAll("/", ".")}.title`);
};

/**
 * Render the current client settings page
 */
export function RenderClientSettings(props: {
  page: Accessor<string | undefined>;
}) {
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
}
