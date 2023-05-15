import { BiRegularCheck, BiSolidError } from "solid-icons/bi";
import { For, createMemo } from "solid-js";

import {
  Languages,
  browserPreferredLanguage,
  language,
  loadAndSetLanguage,
  useTranslation,
} from "@revolt/i18n";
import { LanguageEntry } from "@revolt/i18n/locales/Languages";
import { UnicodeEmoji } from "@revolt/markdown/emoji";
import { Checkbox, Column, Row, Typography } from "@revolt/ui";

/**
 * Language
 */
export default function () {
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
      <LanguageList list={languages().filter(([, lang]) => !lang.cat)} />

      <Typography variant="legacy-modal-title-2">
        {t("app.settings.pages.language.const")}
      </Typography>
      <LanguageList
        list={languages().filter(([, lang]) => lang.cat === "const")}
      />

      <Typography variant="legacy-modal-title-2">
        {t("app.settings.pages.language.other")}
      </Typography>
      <LanguageList
        list={languages().filter(([, lang]) => lang.cat === "alt")}
      />
    </Column>
  );
}

/**
 * Render a list of languages
 */
function LanguageList(props: { list: (readonly [string, LanguageEntry])[] }) {
  return (
    <For each={props.list}>
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
  );
}
