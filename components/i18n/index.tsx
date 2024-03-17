import { createSignal } from "solid-js";

import { createI18nContext, useI18n } from "@solid-primitives/i18n";
import defaultsDeep from "lodash.defaultsdeep";

import { Language, Languages } from "./locales/Languages";
import en from "./locales/en.json";

export { Language, Languages } from "./locales/Languages";
export { I18nContext, useI18n } from "@solid-primitives/i18n";
export * from "./dayjs";

/**
 * Default dictionary object
 */
const dict = {
  en,
};

/**
 * Currently set language
 */
const [language, setLanguage] = createSignal<Language>("en" as Language);
export { language };

/**
 * i18n Context
 */
const context = createI18nContext(dict, "en");
export default context;

/**
 * Use translation function as a hook
 */
export const useTranslation = () => useI18n()[0];

/**
 * Load and set a language by the given key
 */
export async function loadAndSetLanguage(key: Language) {
  if (language() === key) return;
  setLanguage(key);

  const data = await import(`./locales/${Languages[key].i18n}.json`);
  context[1].add(key, defaultsDeep({}, data, en));
  context[1].locale(key);
}

/**
 * Preferred language as reported by the browser
 * @returns Preferred language
 */
export function browserPreferredLanguage() {
  const languages = Object.keys(Languages).map(
    (x) => [x, Languages[x as keyof typeof Languages]] as const
  );

  // Get the user's system language. Check for exact
  // matches first, otherwise check for partial matches
  return (
    navigator.languages
      .map((lang) => languages.find((l) => l[0].replace(/_/g, "-") == lang))
      .filter((lang) => lang)[0]?.[0] ??
    navigator.languages
      .map((x) => x.split("-")[0])
      .map((lang) => languages.find((l) => l[0] == lang))
      .filter((lang) => lang)[0]?.[0] ??
    Language.ENGLISH
  );
}

/**
 * Use quantity translation function as a hook
 */
export const useQuantity = () => {
  const t = useTranslation();
  return (id: string, count: number) =>
    t(`quantities.${id}.${count > 1 ? "many" : "one"}`, {
      count: count.toString(),
    });
};
