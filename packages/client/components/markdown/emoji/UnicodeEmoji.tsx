import { ComponentProps, splitProps } from "solid-js";

import { EmojiBase, toCodepoint } from ".";

export type UnicodeEmojiPacks =
  | "fluent-3d"
  | "fluent-color"
  | "fluent-flat"
  | "mutant"
  | "noto"
  | "openmoji"
  | "twemoji";

export const UNICODE_EMOJI_PACKS: UnicodeEmojiPacks[] = [
  "fluent-3d",
  "fluent-color",
  "fluent-flat",
  "mutant",
  "noto",
  "openmoji",
  "twemoji",
];

export const UNICODE_EMOJI_PACK_PUA: Record<string, string> = {
  // omit fluent-3d as it is the default
  "fluent-color": "\uE0E1",
  "fluent-flat": "\uE0E2",
  mutant: "\uE0E3",
  noto: "\uE0E4",
  openmoji: "\uE0E5",
  twemoji: "\uE0E6",
};

export function unicodeEmojiUrl(
  pack: UnicodeEmojiPacks = "fluent-3d",
  text: string,
) {
  return `https://static.revolt.chat/emoji/${pack}/${toCodepoint(
    text,
  )}.svg?v=1`;
}

/**
 * Display Unicode emoji
 */
export function UnicodeEmoji(
  props: { emoji: string; pack?: UnicodeEmojiPacks } & Omit<
    ComponentProps<typeof EmojiBase>,
    "loading" | "class" | "alt" | "draggable" | "src"
  >,
) {
  const [local, remote] = splitProps(props, ["emoji"]);

  return (
    <EmojiBase
      {...remote}
      loading="lazy"
      class="emoji"
      alt={local.emoji}
      draggable={false}
      src={unicodeEmojiUrl(props.pack, props.emoji)}
    />
  );
}
