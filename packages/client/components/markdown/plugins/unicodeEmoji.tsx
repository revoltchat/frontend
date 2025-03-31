import emojiRegex from "emoji-regex";
import { Handler } from "mdast-util-to-hast";
import { Plugin } from "unified";
import { visit } from "unist-util-visit";

import { UnicodeEmoji } from "../emoji";

/**
 * Render Unicode emoji
 */
export function RenderUnicodeEmoji(props: { str: string }) {
  return <UnicodeEmoji emoji={props.str} />;
}

/**
 * Regex for matching emoji
 */
const RE_EMOJI = new RegExp("(" + emojiRegex().source + ")", "g");

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
          }
      )[] = [
        {
          type: "text",
          value: elements.shift()!,
        },
      ];

      // Process all timestamps
      for (let i = 0; i < elements.length / 2; i++) {
        // Insert components
        newNodes.push({
          type: "unicodeEmoji",
          str: elements[i * 2],
        });

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
    },
  };
};
