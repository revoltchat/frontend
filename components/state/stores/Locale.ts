import { Language, Languages, loadAndSetLanguage } from "@revolt/i18n";

import { State } from "..";

import { AbstractStore } from ".";

export type TypeLocale = {
  /**
   * Current language in use
   */
  lang: Language;
};

export class Locale extends AbstractStore<"locale", TypeLocale> {
  constructor(state: State) {
    super(state, "locale");
  }

  hydrate(): void {
    loadAndSetLanguage(this.get().lang);
  }

  default(): TypeLocale {
    return {
      lang: Language.ENGLISH,
    };
  }

  clean(input: Partial<TypeLocale>): TypeLocale {
    let lang: Language = input.lang!;
    if (!(lang in Languages)) {
      lang = this.default().lang;
    }

    return {
      lang,
    };
  }

  /**
   * Switch to another language
   * @param language Language
   */
  switch(language: Language): void {
    this.set("lang", language);
    this.hydrate();
  }
}
