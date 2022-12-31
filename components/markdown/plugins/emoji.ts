import { MarkdownProps } from "..";

import emojiRegex from "emoji-regex";
import { RE_CUSTOM_EMOJI } from "./customEmoji";

const RE_ANY_EMOJI = new RegExp(
  RE_CUSTOM_EMOJI.source + "|" + emojiRegex().source,
  "g"
);

export function isOnlyEmoji(text: string) {
  return text.replaceAll(RE_ANY_EMOJI, "").trim().length === 0;
}

export function injectEmojiSize(
  props: MarkdownProps,
  hastNode: { children?: { properties: Record<string, string> }[] }
) {
  // inject emoji size information
  const properties = (
    hastNode as { children?: { properties: Record<string, string> }[] }
  ).children?.[0].properties;

  // inject custom property
  if (properties) {
    let size = "small";

    if (!props.disallowBigEmoji && isOnlyEmoji(props.content)) {
      // will always match at least one
      RE_ANY_EMOJI.lastIndex = 0;
      RE_ANY_EMOJI.exec(props.content);

      // large by default
      size = "large";

      // check if we match more than one
      // if so, make it slightly smaller
      if (RE_ANY_EMOJI.exec(props.content)) {
        size = "medium";
      }
    }

    properties["emoji-size"] = size;
  }
}
