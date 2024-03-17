import { createEffect, createSignal, on } from "solid-js";
import { styled } from "solid-styled-components";

import "katex/dist/katex.min.css";
import { html } from "property-information";
import rehypeKatex from "rehype-katex";
import rehypePrism from "rehype-prism";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { VFile } from "vfile";

import { injectEmojiSize } from "./emoji/util";
import { handlers } from "./hast";
import { RenderCodeblock } from "./plugins/Codeblock";
import { RenderAnchor } from "./plugins/anchors";
import { RenderChannel, remarkChannels } from "./plugins/channels";
import { RenderCustomEmoji, remarkCustomEmoji } from "./plugins/customEmoji";
import { remarkHtmlToText } from "./plugins/htmlToText";
import { RenderMention, remarkMention } from "./plugins/mentions";
import { RenderSpoiler, remarkSpoiler } from "./plugins/spoiler";
import { remarkTimestamps } from "./plugins/timestamps";
import { RenderUnicodeEmoji, remarkUnicodeEmoji } from "./plugins/unicodeEmoji";
import { remarkInsertBreaks, sanitise } from "./sanitise";
import { childrenToSolid } from "./solid-markdown/ast-to-solid";
import { defaults } from "./solid-markdown/defaults";

/**
 * Empty component
 */
const Null = () => null;

/**
 * Custom Markdown components
 */
const components = {
  uemoji: RenderUnicodeEmoji,
  cemoji: RenderCustomEmoji,
  mention: RenderMention,
  spoiler: RenderSpoiler,
  channel: RenderChannel,
  a: RenderAnchor,
  p: styled.p<{ ["emoji-size"]?: "medium" | "large" }>`
    margin: 0;

    > code {
      padding: 1px 4px;
      flex-shrink: 0;
    }

    ${(props) =>
      props["emoji-size"]
        ? `--emoji-size:${props.theme!.layout.emoji[props["emoji-size"]]};`
        : ""}
  `,
  h1: styled.h1`
    margin: 0.2em 0;
  `,
  h2: styled.h2`
    margin: 0.2em 0;
  `,
  h3: styled.h3`
    margin: 0.2em 0;
  `,
  h4: styled.h4`
    margin: 0.2em 0;
  `,
  h5: styled.h5`
    margin: 0.2em 0;
  `,
  h6: styled.h6`
    margin: 0.2em 0;
  `,
  pre: RenderCodeblock,
  code: styled.code`
    color: ${(props) =>
      props.theme!.colours["messaging-component-code-block-foreground"]};
    background: ${(props) =>
      props.theme!.colours["messaging-component-code-block-background"]};

    font-size: 90%;
    font-family: ${(props) => props.theme!.fonts.monospace};

    border-radius: 3px;
    box-decoration-break: clone;
  `,
  table: styled.table`
    border-collapse: collapse;

    th,
    td {
      padding: 6px;
      border: 1px solid ${(props) => props.theme!.colours.foreground};
    }
  `,
  ul: styled.ul`
    list-style-position: outside;
    padding-left: 1.5em;
    margin: 0.2em 0;
  `,
  ol: styled.ol`
    list-style-position: outside;
    padding-left: 1.5em;
    margin: 0.2em 0;
  `,
  blockquote: styled.blockquote`
    margin: 2px 0;
    padding: 2px 8px;
    border-radius: ${(props) => props.theme!.borderRadius.md};
    color: ${(props) =>
      props.theme!.colours["messaging-component-blockquote-foreground"]};
    background: ${(props) =>
      props.theme!.colours["messaging-component-blockquote-background"]};
    border-inline-start: 3px solid
      ${(props) =>
        props.theme!.colours["messaging-component-blockquote-foreground"]};
  `,
  // Block image elements
  img: Null,
  // Catch literally everything else just in case
  video: Null,
  figure: Null,
  picture: Null,
  source: Null,
  audio: Null,
  script: Null,
  style: Null,
};

/**
 * Unified Markdown renderer
 */
const pipeline = unified()
  .use(remarkParse)
  .use(remarkBreaks)
  .use(remarkGfm)
  .use(remarkMath)
  .use(remarkSpoiler)
  .use(remarkTimestamps)
  .use(remarkChannels)
  .use(remarkMention)
  .use(remarkUnicodeEmoji)
  .use(remarkCustomEmoji)
  .use(remarkHtmlToText)
  .use(remarkRehype, {
    handlers,
  })
  .use(remarkInsertBreaks)
  .use(rehypeKatex, {
    maxSize: 10,
    maxExpand: 0,
    trust: false,
    strict: false,
    output: "html",
    throwOnError: false,
    errorColor: "var(--error)",
  })
  .use(rehypePrism);

export interface MarkdownProps {
  /**
   * Content to render
   */
  content?: string;

  /**
   * Whether to prevent big emoji from rendering
   */
  disallowBigEmoji?: boolean;
}

export { TextWithEmoji } from "./emoji/TextWithEmoji";
export { Emoji } from "./emoji/Emoji";

/**
 * Remark renderer component
 */
export function Markdown(props: MarkdownProps) {
  /**
   * Render some given Markdown content
   * @param content content
   */
  function render(content = "") {
    const file = new VFile();
    file.value = sanitise(content);

    const hastNode = pipeline.runSync(pipeline.parse(file), file);

    if (hastNode.type !== "root") {
      throw new TypeError("Expected a `root` node");
    }

    injectEmojiSize(props, hastNode as any);

    return childrenToSolid(
      {
        options: {
          ...defaults,
          components,
        },
        schema: html,
        listDepth: 0,
      },
      // @ts-expect-error this is the correct type
      hastNode
    );
  }

  // Render once immediately
  const [children, setChildren] = createSignal(render(props.content));

  // If it ever updates, re-render the whole tree:
  createEffect(
    on(
      () => props.content,
      (content) => setChildren(render(content)),
      { defer: true }
    )
  );

  // Give it to Solid:
  return <>{children()}</>;
}
