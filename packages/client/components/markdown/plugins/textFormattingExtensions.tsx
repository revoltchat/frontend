import { Handler } from "mdast-util-to-hast";
import { cva } from "styled-system/css";
import { Plugin } from "unified";
import { visit } from "unist-util-visit";
import z from "zod";

type Attributes = Partial<{
  colour: string;
  opacity: number;
  font: "sans-serif" | "serif" | "monospace" | "cursive" | "casual" | "rounded";
  size: number;
  background: string;
  weight: number;
}>;

export function RenderFormatter(props: {
  attributes: Attributes;
  children: Element;
}) {
  // const [shown, setShown] = createSignal(false);

  return (
    <span
      style={{
        color: props.attributes.colour,
        background: props.attributes.background,
        opacity: props.attributes.opacity,
        "font-weight": props.attributes.weight,
        "font-size": props.attributes.size
          ? `${props.attributes.size}em`
          : undefined,
      }}
    >
      {props.children}
    </span>
    // <Spoiler shown={shown()} onClick={() => setShown(true)}>
    // {props.children}
    // </Spoiler>
  );
}

const RE_STYLE_BRACE =
  /\{([a-zA-Z]+):([^;]+?)(?:;\s*([a-zA-Z]+):([^;]+?))*\}\(/d;

const RE_BRACKET = /\(|\)/g;

function reachesCloseBracket(value: string, idx: number) {
  let ident = 1;

  RE_BRACKET.lastIndex = idx;
  let match = RE_BRACKET.exec(value);
  while (match) {
    if (match[0] === "(") ident++;
    else ident--;

    if (ident === 0) {
      return true;
    }

    match = RE_BRACKET.exec(value);
  }

  return false;
}

const schema = z
  .object({
    colour: z.string(), // TODO: untrusted
    opacity: z.preprocess(
      (val) => String(val).slice(0, String(val).length - 1),
      z.coerce
        .number()
        .gte(0)
        .lte(100)
        .int()
        .transform((v) => v / 100)
    ),
    font: z.enum([
      "sans-serif",
      "serif",
      "monospace",
      "cursive",
      "casual",
      "rounded",
    ]),
    size: z.coerce.number().gte(0.25).lte(5.0),
    background: z.string(), // TODO: untrusted
    weight: z.coerce.number().gte(50).lte(950).int(),
  })
  .partial();

function visitor(node: {
  children: (
    | { type: "text"; value: string }
    | { type: "paragraph"; children: any[] }
    | { type: "formatter"; children: any[]; attributes: Attributes }
  )[];
}) {
  // Visit all children of paragraphs
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];

    // Find the next text element to start a formatter from
    if (child.type === "text") {
      // console.info(i, child);

      RE_STYLE_BRACE.lastIndex = 0;
      const styleBrace = RE_STYLE_BRACE.exec(child.value);
      if (styleBrace) {
        const rawAttrs: { [key: string]: string } = styleBrace
          .slice(1)
          .filter((x) => x) // js preallocates array from previous runs, so we end up with undefined values
          .reduce(
            (obj, value, idx) =>
              idx % 2
                ? {
                    ...(obj as [{}])[0],
                    [(obj as [{}, string])[1]]: value.trim(),
                  }
                : [obj, value === "color" ? "colour" : value],
            {}
          );

        try {
          const attributes = schema.parse(rawAttrs);
          const [start, end] = styleBrace.indices![0];

          let successfulMatch = false;
          if (reachesCloseBracket(child.value, styleBrace.indices![0][1])) {
            // case: split on this element
            successfulMatch = true;

            // recursively process children
            let children = [
              {
                type: "text",
                value: child.value.substring(end, RE_BRACKET.lastIndex - 1),
              },
            ];

            // need to preserve this value as it can be affected in call
            const lastIndex = RE_BRACKET.lastIndex;
            visitor({ children: children as never });

            // create the formatter and append elements
            node.children.splice(
              i + 1,
              0,
              {
                type: "formatter",
                attributes,
                children,
              },
              {
                type: "text",
                value: child.value.substring(lastIndex),
              }
            );
          } else {
            // case: search other elements and split on whichever matches
            let j = i + 1,
              foundEnd: { type: "text"; value: string } | undefined;

            for (; j < node.children.length; j++) {
              const el = node.children[j];
              if (el.type === "text") {
                if (reachesCloseBracket(el.value, 0)) {
                  foundEnd = el;
                  break;
                }
              }
            }

            if (foundEnd) {
              successfulMatch = true;

              // recursively process children
              let children = [
                {
                  type: "text",
                  value: child.value.substring(end),
                },
                ...node.children.slice(i + 1, j),
                {
                  type: "text",
                  value: foundEnd.value.substring(0, RE_BRACKET.lastIndex - 1),
                },
              ];

              // need to preserve this value as it can be affected in call
              const lastIndex = RE_BRACKET.lastIndex;
              visitor({ children: children as never });

              // insert the formatter
              node.children.splice(
                i + 1,
                j - i,
                {
                  type: "formatter",
                  attributes,
                  children,
                },
                {
                  type: "text",
                  value: foundEnd.value.substring(lastIndex),
                }
              );
            }
          }

          if (successfulMatch) {
            // we will naturally skip over the `formatter` and
            // reach the next `text` element, so no index
            // manipulation is necessary for it

            // strip the value
            child.value = child.value.substring(0, start);
          }
        } catch (err) {
          // skip, invalid!
          console.error("zod!", err, rawAttrs);
        }
      }
    }
  }
}

export const remarkTextFormattingExtensions: Plugin = () => (tree) => {
  visit(tree, "paragraph", visitor);
};

export const textFormatHandler: Handler = (h, node) => {
  return {
    type: "element" as const,
    tagName: "formatter",
    children: h.all({
      type: "paragraph",
      children: node.children,
    }),
    properties: {
      attributes: node.attributes,
    },
  };
};
