import { createI18nContext } from "@solid-primitives/i18n";

export { I18nContext, useI18n } from "@solid-primitives/i18n";
export { LocaleSelector } from "./LocaleSelector";

import en from "./locales/en.json";

const dict = {
  en,
};

export default createI18nContext(dict, "en");
