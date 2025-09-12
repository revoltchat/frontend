import emojiRegex from "emoji-regex";
import { Handler } from "mdast-util-to-hast";
import { Plugin } from "unified";
import { visit } from "unist-util-visit";

import { UnicodeEmoji } from "../emoji";
import { UnicodeEmojiPacks } from "../emoji/UnicodeEmoji";

/**
 * Render Unicode emoji
 */
export function RenderUnicodeEmoji(props: {
  str: string;
  pack: UnicodeEmojiPacks;
}) {
  return <UnicodeEmoji emoji={props.str} pack={props.pack} />;
}

/**
 * Regex for matching emoji
 */
const RE_EMOJI = new RegExp(
  "([\uE0E0-\uE0E6]?(?:" + emojiRegex().source + "))",
  "g",
);

const MIN_PACK = "\uE0E0".codePointAt(0)!;
const MAX_PACK = "\uE0E6".codePointAt(0)!;

const PACK_MAPPING: Record<string, UnicodeEmojiPacks> = {
  ["\uE0E0"]: "fluent-3d",
  ["\uE0E1"]: "fluent-color",
  ["\uE0E2"]: "fluent-flat",
  ["\uE0E3"]: "mutant",
  ["\uE0E4"]: "noto",
  ["\uE0E5"]: "openmoji",
  ["\uE0E6"]: "twemoji",
};

export const remarkUnicodeEmoji: Plugin = () => (tree) => {
  visit(
    tree,
    "text",
    (
      node: { type: "text"; value: string },
      idx,
      parent: { children: any[] },
    ) => {
      const elements = node.value.split(RE_EMOJI);
      if (elements.length === 1) return; // no matches

      // Generate initial node
      const newNodes: (
        | { type: "text"; value: string }
        | {
            type: "unicodeEmoji";
            str: string;
            pack?: UnicodeEmojiPacks;
          }
      )[] = [
        {
          type: "text",
          value: elements.shift()!,
        },
      ];

      // Process all timestamps
      for (let i = 0; i < elements.length / 2; i++) {
        const selectorChar = elements[i * 2][0];
        const selector = selectorChar.codePointAt(0);
        if (selector && selector >= MIN_PACK && selector <= MAX_PACK) {
          newNodes.push({
            type: "unicodeEmoji",
            str: elements[i * 2].substring(1),
            pack: PACK_MAPPING[selectorChar],
          });
        } else {
          newNodes.push({
            type: "unicodeEmoji",
            str: elements[i * 2],
          });
        }

        newNodes.push({
          type: "text",
          value: elements[i * 2 + 1],
        });
      }

      parent.children.splice(idx, 1, ...newNodes);
      return idx + newNodes.length;
    },
  );
};

export const unicodeEmojiHandler: Handler = (h, node) => {
  return {
    type: "element" as const,
    tagName: "unicodeEmoji",
    children: [],
    properties: {
      str: node.str,
      pack: node.pack,
    },
  };
};
