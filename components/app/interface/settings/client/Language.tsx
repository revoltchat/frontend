import {
  BiRegularAlignLeft,
  BiRegularAlignRight,
  BiRegularCheck,
  BiRegularGlobeAlt,
  BiRegularTime,
  BiSolidError,
  BiSolidTime,
} from "solid-icons/bi";
import { For, Match, Show, Switch, createMemo } from "solid-js";

import {
  Languages,
  browserPreferredLanguage,
  language,
  loadAndSetLanguage,
  useTranslation,
} from "@revolt/i18n";
import { LanguageEntry } from "@revolt/i18n/locales/Languages";
import { UnicodeEmoji } from "@revolt/markdown/emoji";
import {
  CategoryButton,
  CategoryCollapse,
  Checkbox,
  Column,
  Disabled,
  FormGroup,
  LegacyCheckbox,
  Row,
  Time,
} from "@revolt/ui";

/**
 * Language
 */
export default function Language() {
  const t = useTranslation();

  /**
   * Determine the current language
   */
  const currentLanguage = () => Languages[language()];

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

  const LastWeek = new Date();
  LastWeek.setDate(LastWeek.getDate() - 7);

  return (
    <Column>
      <CategoryCollapse
        icon={<BiRegularGlobeAlt size={24} />}
        title={t("app.settings.pages.language.select")}
        description={currentLanguage().display}
      >
        <For each={languages()}>
          {([id, lang]) => (
            <CategoryButton
              icon={<UnicodeEmoji emoji={lang.emoji} />}
              action={<Checkbox value={id === language()} />}
              onClick={() => loadAndSetLanguage(id as never)}
            >
              <Row>
                {lang.display} {lang.verified && <BiRegularCheck size={16} />}{" "}
                {lang.incomplete && <BiSolidError size={16} />}
              </Row>
            </CategoryButton>
          )}
        </For>
      </CategoryCollapse>

      <Disabled>
        <Column>
          <CategoryCollapse
            icon={<BiRegularTime size={24} />}
            title="Select date format"
            description={`Traditional`}
          >
            <FormGroup>
              <CategoryButton
                icon={"blank"}
                onClick={() => void 0}
                action={<Checkbox value />}
                description={<Time format="date" value={LastWeek} />}
              >
                Traditional
              </CategoryButton>
            </FormGroup>
            <FormGroup>
              <CategoryButton
                icon={"blank"}
                onClick={() => void 0}
                action={<Checkbox />}
                description={<Time format="dateAmerican" value={LastWeek} />}
              >
                American (Month-Day)
              </CategoryButton>
            </FormGroup>
            <FormGroup>
              <CategoryButton
                icon={"blank"}
                onClick={() => void 0}
                action={<Checkbox />}
                description={<Time format="iso8601" value={LastWeek} />}
              >
                ISO8601
              </CategoryButton>
            </FormGroup>
          </CategoryCollapse>

          <CategoryCollapse
            icon={<BiRegularTime size={24} />}
            title="Select time format"
            description={`24 hours`}
          >
            <FormGroup>
              <CategoryButton
                icon={"blank"}
                onClick={() => void 0}
                action={<Checkbox value />}
                description={<Time format="time24" value={new Date()} />}
              >
                24 hours
              </CategoryButton>
            </FormGroup>
            <FormGroup>
              <CategoryButton
                icon={"blank"}
                onClick={() => void 0}
                action={<Checkbox />}
                description={<Time format="time12" value={new Date()} />}
              >
                12 hours
              </CategoryButton>
            </FormGroup>
          </CategoryCollapse>

          <Switch
            fallback={
              <CategoryButton
                icon={<BiRegularAlignRight size={24} />}
                description="Flip the user interface right to left"
                action={<Checkbox />}
                onClick={() => void 0}
              >
                Enable RTL layout
              </CategoryButton>
            }
          >
            <Match when={currentLanguage().rtl}>
              <CategoryButton
                icon={<BiRegularAlignLeft size={24} />}
                description="Keep the user interface left to right"
                action={<Checkbox />}
                onClick={() => void 0}
              >
                Force LTR layout
              </CategoryButton>
            </Match>
          </Switch>
        </Column>
      </Disabled>
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
        <LegacyCheckbox
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
