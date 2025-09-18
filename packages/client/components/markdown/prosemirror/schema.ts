import { CodeBlockNodeName } from "prosemirror-codemirror-block";
import { MarkSpec, Schema } from "prosemirror-model";

import { mention } from "../plugins/mentions";

/// Document schema for the data model used by CommonMark.
export const schema = new Schema({
  nodes: {
    doc: {
      content: "block+",
    },

    paragraph: {
      content: "inline*",
      group: "block",
      parseDOM: [{ tag: "p" }],
      toDOM() {
        return ["p", 0];
      },
    },

    blockquote: {
      content: "block+",
      group: "block",
      parseDOM: [{ tag: "blockquote" }],
      toDOM() {
        return ["blockquote", 0];
      },
    },

    horizontal_rule: {
      group: "block",
      parseDOM: [{ tag: "hr" }],
      toDOM() {
        return ["div", ["hr"]];
      },
    },

    heading: {
      attrs: { level: { default: 1 } },
      content:
        "(text | image | rfm_custom_emoji | rfm_user_mention | rfm_role_mention | rfm_channel_mention)*",
      group: "block",
      defining: true,
      parseDOM: [
        { tag: "h1", attrs: { level: 1 } },
        { tag: "h2", attrs: { level: 2 } },
        { tag: "h3", attrs: { level: 3 } },
        { tag: "h4", attrs: { level: 4 } },
        { tag: "h5", attrs: { level: 5 } },
        { tag: "h6", attrs: { level: 6 } },
      ],
      toDOM(node) {
        return ["h" + node.attrs.level, 0];
      },
    },

    [CodeBlockNodeName]: {
      content: "text*",
      group: "block",
      code: true,
      defining: true,
      marks: "",
      attrs: { params: { default: "" }, lang: { default: null } },
      parseDOM: [
        {
          tag: "pre",
          preserveWhitespace: "full",
          getAttrs: (node) => ({
            params: (node as HTMLElement).getAttribute("data-params") || "",
          }),
        },
      ],
      toDOM(node) {
        return [
          "pre",
          node.attrs.params ? { "data-params": node.attrs.params } : {},
          ["code", 0],
        ];
      },
    },

    ordered_list: {
      content: "list_item+",
      group: "block",
      attrs: { order: { default: 1 }, tight: { default: false } },
      parseDOM: [
        {
          tag: "ol",
          getAttrs(dom) {
            return {
              order: (dom as HTMLElement).hasAttribute("start")
                ? +(dom as HTMLElement).getAttribute("start")!
                : 1,
              tight: (dom as HTMLElement).hasAttribute("data-tight"),
            };
          },
        },
      ],
      toDOM(node) {
        return [
          "ol",
          {
            start: node.attrs.order == 1 ? null : node.attrs.order,
            "data-tight": node.attrs.tight ? "true" : null,
          },
          0,
        ];
      },
    },

    bullet_list: {
      content: "list_item+",
      group: "block",
      attrs: { tight: { default: false } },
      parseDOM: [
        {
          tag: "ul",
          getAttrs: (dom) => ({
            tight: (dom as HTMLElement).hasAttribute("data-tight"),
          }),
        },
      ],
      toDOM(node) {
        return ["ul", { "data-tight": node.attrs.tight ? "true" : null }, 0];
      },
    },

    list_item: {
      content: "block+",
      defining: true,
      parseDOM: [{ tag: "li" }],
      toDOM() {
        return ["li", 0];
      },
    },

    text: {
      group: "inline",
    },

    image: {
      inline: true,
      attrs: {
        src: {},
        alt: { default: null },
        title: { default: null },
        style: { default: null },
      },
      group: "inline",
      draggable: true,
      parseDOM: [
        {
          tag: "img[src]",
          getAttrs(dom) {
            return {
              src: (dom as HTMLElement).getAttribute("src"),
              title: (dom as HTMLElement).getAttribute("title"),
              alt: (dom as HTMLElement).getAttribute("alt"),
            };
          },
        },
      ],
      toDOM(node) {
        return ["img", node.attrs];
      },
    },

    hard_break: {
      inline: true,
      group: "inline",
      selectable: false,
      parseDOM: [{ tag: "br" }],
      toDOM() {
        return ["br"];
      },
    },

    rfm_custom_emoji: {
      inline: true,
      attrs: {
        id: {},
        src: {},
      },
      group: "inline",
      draggable: true,
      parseDOM: [
        {
          tag: "img[emoji-id]",
          getAttrs(dom) {
            return {
              id: (dom as HTMLElement).getAttribute("emoji-id"),
              src: (dom as HTMLElement).getAttribute("src"),
            };
          },
        },
      ],
      toDOM(node) {
        return [
          "img",
          {
            "emoji-id": node.attrs.id,
            src: node.attrs.src,
            style:
              "width: var(--emoji-size); height: var(--emoji-size); display: inline; object-fit: contain",
          },
        ];
      },
    },

    rfm_unicode_emoji: {
      inline: true,
      attrs: {
        id: {},
        pack: { default: null },
        src: {},
      },
      group: "inline",
      draggable: true,
      parseDOM: [
        {
          tag: "img[unicode]",
          getAttrs(dom) {
            return {
              id: (dom as HTMLElement).getAttribute("unicode"),
              pack: (dom as HTMLElement).getAttribute("pack"),
              src: (dom as HTMLElement).getAttribute("src"),
            };
          },
        },
      ],
      toDOM(node) {
        return [
          "img",
          {
            unicode: node.attrs.id,
            pack: node.attrs.pack,
            src: node.attrs.src,
            style:
              "width: var(--emoji-size); height: var(--emoji-size); display: inline; object-fit: contain",
          },
        ];
      },
    },

    rfm_user_mention: {
      inline: true,
      attrs: {
        id: {},
        username: {},
        avatar: {},
      },
      group: "inline",
      draggable: true,
      parseDOM: [
        {
          tag: "span[user-id]",
          getAttrs(dom) {
            return {
              id: (dom as HTMLElement).getAttribute("user-id"),
              username: (dom as HTMLElement).innerText,
            };
          },
        },
      ],
      toDOM(node) {
        return [
          "span",
          {
            "user-id": node.attrs.id,
            class: mention({ inEditor: true }),
          },
          [
            "img",
            {
              src: node.attrs.avatar,
            },
          ],
          node.attrs.username,
        ];
      },
    },

    rfm_role_mention: {
      inline: true,
      attrs: {
        id: {},
        name: {},
      },
      group: "inline",
      draggable: true,
      parseDOM: [
        {
          tag: "span[role-id]",
          getAttrs(dom) {
            return {
              id: (dom as HTMLElement).getAttribute("role-id"),
              name: (dom as HTMLElement).innerText,
            };
          },
        },
      ],
      toDOM(node) {
        return [
          "span",
          {
            "role-id": node.attrs.id,
            class: mention({ inEditor: true }),
          },
          "%" + node.attrs.name,
        ];
      },
    },

    rfm_channel_mention: {
      inline: true,
      attrs: {
        id: {},
        name: {},
      },
      group: "inline",
      draggable: true,
      parseDOM: [
        {
          tag: "span[channel-id]",
          getAttrs(dom) {
            return {
              id: (dom as HTMLElement).getAttribute("channel-id"),
              name: (dom as HTMLElement).innerText,
            };
          },
        },
      ],
      toDOM(node) {
        return [
          "span",
          {
            "channel-id": node.attrs.id,
            class: mention({ inEditor: true }),
          },
          "#" + node.attrs.name,
        ];
      },
    },
  },

  marks: {
    em: {
      parseDOM: [
        { tag: "i" },
        { tag: "em" },
        { style: "font-style=italic" },
        { style: "font-style=normal", clearMark: (m) => m.type.name == "em" },
      ],
      toDOM() {
        return ["em"];
      },
    },

    strong: {
      parseDOM: [
        { tag: "strong" },
        {
          tag: "b",
          getAttrs: (node) => node.style.fontWeight != "normal" && null,
        },
        { style: "font-weight=400", clearMark: (m) => m.type.name == "strong" },
        {
          style: "font-weight",
          getAttrs: (value) => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null,
        },
      ],
      toDOM() {
        return ["strong"];
      },
    } as MarkSpec,

    strikethrough: {
      parseDOM: [{ tag: "s" }],
      toDOM() {
        return ["s"];
      },
    } as MarkSpec,

    link: {
      attrs: {
        href: {},
        title: { default: null },
      },
      inclusive: false,
      parseDOM: [
        {
          tag: "a[href]",
          getAttrs(dom) {
            return {
              href: (dom as HTMLElement).getAttribute("href"),
              title: dom.getAttribute("title"),
            };
          },
        },
      ],
      toDOM(node) {
        return ["a", node.attrs];
      },
    },

    code: {
      code: true,
      parseDOM: [{ tag: "code" }],
      toDOM() {
        return ["code"];
      },
    },
  },
});
