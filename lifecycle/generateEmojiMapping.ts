import { resolve } from "jsr:@std/path";

const ordering = await fetch(
  "https://raw.githubusercontent.com/googlefonts/emoji-metadata/main/emoji_15_0_ordering.json"
).then((res) => res.json());

const Mapping: Record<string, string> = {};

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

Deno.writeTextFile(
  resolve(
    import.meta.dirname!,
    "packages/client/components/ui/emojiMapping.json"
  ),
  JSON.stringify(Mapping)
);
