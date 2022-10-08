import { createI18nContext, useI18n } from "@solid-primitives/i18n";

export { I18nContext, useI18n } from "@solid-primitives/i18n";
export { LocaleSelector } from "./LocaleSelector";
export * from "./dayjs";

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
