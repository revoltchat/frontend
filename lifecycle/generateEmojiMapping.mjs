import { writeFile } from "node:fs/promises";

const ordering = await fetch(
  "https://raw.githubusercontent.com/googlefonts/emoji-metadata/main/emoji_15_0_ordering.json"
).then((res) => res.json());

const Mapping = {};

for (const group of Object.keys(ordering)) {
  for (const emote of ordering[group].emoji) {
    const emoji = String.fromCodePoint(...emote.base);

    for (const shortcode of emote.shortcodes) {
      Mapping[
        shortcode
          .substring(1, shortcode.length - 1)
          .replace(/ /g, "-")
          .toLowerCase()
      ] = emoji;
    }
  }
}

writeFile("components/ui/emojiMapping.json", JSON.stringify(Mapping), "utf8");
