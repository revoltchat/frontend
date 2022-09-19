import { Language, Languages } from "./locales/Languages";
import { useI18n } from "@solid-primitives/i18n";
import { ComboBox } from "@revolt/ui";
import { For } from "solid-js";

export function LocaleSelector() {
  const [_, { locale, add }] = useI18n();

  async function switchLanguage(key: Language) {
    const data = await import(`./locales/${key}.json`);
    add(key, data);
    locale(key);
  }

  return (
    <ComboBox
      value={locale()}
      onChange={(e) => switchLanguage(e.currentTarget.value as Language)}
    >
      <For each={Object.keys(Languages)}>
        {(lang) => {
          const l = Languages[lang as Language];
          return (
            <option value={lang}>
              {l.emoji} {l.display}
            </option>
          );
        }}
      </For>
    </ComboBox>
  );
}
