import { JSX } from "solid-js";

import emojiRegex from "emoji-regex";

import { MarkdownProps } from "..";

import { RE_CUSTOM_EMOJI, RenderCustomEmoji } from "./customEmoji";
import { RenderUnicodeEmoji } from "./unicodeEmoji";

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
    if (!props.disallowBigEmoji && isOnlyEmoji(props.content)) {
      // will always match at least one
      RE_ANY_EMOJI.lastIndex = 0;
      RE_ANY_EMOJI.exec(props.content);

      // large by default
      let size = "large";

      // check if we match more than one
      // if so, make it slightly smaller
      if (RE_ANY_EMOJI.exec(props.content)) {
        size = "medium";
      }

      properties["emoji-size"] = size;
    }
  }
}

export function TextWithEmoji(props: { content?: string }) {
  function render(content?: string) {
    if (!content) return null;

    const components: JSX.Element[] = [];

    let lastIndex = 0;

    function pushToIndex(index: number) {
      if (lastIndex === index) return;
      components.push(<>{content!.slice(lastIndex, index)}</>);
    }

    RE_ANY_EMOJI.lastIndex = 0;
    let match = RE_ANY_EMOJI.exec(content);
    while (match) {
      pushToIndex(match.index);
      lastIndex = match.index + match[0].length;

      components.push(
        match[0].length === 28 ? (
          <RenderCustomEmoji match={match[1]} str={match[0]} />
        ) : (
          <RenderUnicodeEmoji match={match[1]} str={match[0]} />
        )
      );

      match = RE_ANY_EMOJI.exec(content);
    }

    pushToIndex(content.length);

    return components;
  }

  return <>{render(props.content)}</>;
}
