import { BiRegularCheck, BiSolidError } from "solid-icons/bi";
import { For, Match, Switch, createMemo } from "solid-js";

import {
  Languages,
  browserPreferredLanguage,
  language,
  loadAndSetLanguage,
  useTranslation,
} from "@revolt/i18n";
import { UnicodeEmoji } from "@revolt/markdown/emoji";
import {
  CategoryButton,
  CategoryButtonGroup,
  CategoryCollapse,
  Checkbox,
  Column,
  FormGroup,
  Row,
  Time,
  iconSize,
  styled,
} from "@revolt/ui";

import MdCalendarMonth from "@material-design-icons/svg/outlined/calendar_month.svg?component-solid";
import MdKeyboardTab from "@material-design-icons/svg/outlined/keyboard_tab.svg?component-solid";
import MdKeyboardTabRtl from "@material-design-icons/svg/outlined/keyboard_tab.svg?component-solid";
import MdLanguage from "@material-design-icons/svg/outlined/language.svg?component-solid";
import MdSchedule from "@material-design-icons/svg/outlined/schedule.svg?component-solid";

/**
 * Language
 */
export default function Language() {
  return (
    <Column gap="lg">
      <CategoryButtonGroup>
        <PickLanguage />
        <ConfigureRTL />
      </CategoryButtonGroup>
      <CategoryButtonGroup>
        <PickDateFormat />
        <PickTimeFormat />
      </CategoryButtonGroup>
      <CategoryButtonGroup>
        <ContributeLanguageLink />
      </CategoryButtonGroup>
    </Column>
  );
}

/**
 * Pick user's preferred language
 */
function PickLanguage() {
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

  return (
    <CategoryCollapse
      icon={<MdLanguage {...iconSize(24)} />}
      title={t("app.settings.pages.language.select")}
      description={currentLanguage().display}
      scrollable
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
  );
}

/**
 * Pick user's preferred date format
 */
function PickDateFormat() {
  const LastWeek = new Date();
  LastWeek.setDate(LastWeek.getDate() - 7);

  return (
    <CategoryCollapse
      icon={<MdCalendarMonth {...iconSize(24)} />}
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
  );
}

/**
 * Pick user's preferred time format
 */
function PickTimeFormat() {
  return (
    <CategoryCollapse
      icon={<MdSchedule {...iconSize(24)} />}
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
  );
}

/**
 * Configure right-to-left display
 */
function ConfigureRTL() {
  /**
   * Determine the current language
   */
  const currentLanguage = () => Languages[language()];

  return (
    <Switch
      fallback={
        <CategoryButton
          icon={<MdKeyboardTabRtl {...iconSize(24)} />}
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
          icon={<MdKeyboardTab {...iconSize(24)} />}
          description="Keep the user interface left to right"
          action={<Checkbox />}
          onClick={() => void 0}
        >
          Force LTR layout
        </CategoryButton>
      </Match>
    </Switch>
  );
}

/**
 * Language contribution link
 */
function ContributeLanguageLink() {
  return (
    <a href="https://weblate.insrt.uk/projects/revolt/web-app/" target="_blank">
      <CategoryButton
        action="external"
        icon={<MdLanguage {...iconSize(24)} />}
        onClick={() => void 0}
        description="Help contribute to an existing or new language"
      >
        Contribute a language
      </CategoryButton>
    </a>
  );
}
