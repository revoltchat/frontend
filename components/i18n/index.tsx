import { createI18nContext, useI18n } from "@solid-primitives/i18n";

export { I18nContext, useI18n } from "@solid-primitives/i18n";
export { LocaleSelector } from "./LocaleSelector";

import en from "./locales/en.json";

/**
 * Default dictionary object
 */
const dict = {
  en,
};

/**
 * i18n Context
 */
export default createI18nContext(dict, "en");

/**
 * Use translation function as a hook
 */
export const useTranslation = () => useI18n()[0];
