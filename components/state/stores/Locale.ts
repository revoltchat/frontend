import { State } from "..";
import { AbstractStore } from ".";
import { Language, loadAndSetLanguage, Languages } from "@revolt/i18n";

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

  clean(input: TypeLocale) {
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
