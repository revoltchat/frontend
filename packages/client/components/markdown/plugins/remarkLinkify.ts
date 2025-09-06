import LinkifyIt from "linkify-it";
import { Plugin } from "unified";
import { visit } from "unist-util-visit";

const linkify = new LinkifyIt({
  fuzzyLink: false,
});

export const remarkLinkify: Plugin = () => (tree) => {
  visit(
    tree,
    "text",
    (
      node: { type: "text"; value: string },
      idx,
      parent: { children: unknown[] },
    ) => {
      const links = linkify.match(node.value);
      if (links === null) return; // no matches

      const newNodes: (
        | { type: "text"; value: string }
        | {
            type: "link";
            children: { type: "text"; value: string }[];
          }
      )[] = [
        {
          type: "text",
          value: node.value.slice(0, links[0].index),
        },
        ...links.flatMap((link, idx) => [
          {
            type: "link" as const,
            url: link.url,
            title: link.text,
            children: [
              {
                type: "text" as const,
                value: link.text,
              },
            ],
          },
          {
            type: "text" as const,
            value: node.value.slice(
              link.lastIndex,
              links[idx + 1]?.index ?? node.value.length,
            ),
          },
        ]),
      ];

      parent.children.splice(idx, 1, ...newNodes);
      return idx + newNodes.length;
    },
  );
};
