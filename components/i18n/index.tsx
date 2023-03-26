import { createI18nContext, useI18n } from "@solid-primitives/i18n";

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
  const data = await import(`./locales/${Languages[key].i18n}.json`);
  context[1].add(key, data);
  context[1].locale(key);
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
