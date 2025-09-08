import { createEffect, createSignal, on } from "solid-js";

import "katex/dist/katex.min.css";
import { html } from "property-information";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { VFile } from "vfile";

import * as elements from "./elements";
import { injectEmojiSize } from "./emoji/util";
import { RenderCodeblock } from "./plugins/Codeblock";
import { RenderAnchor } from "./plugins/anchors";
import { remarkChannels } from "./plugins/channels";
import {
  RenderCustomEmoji,
  customEmojiHandler,
  remarkCustomEmoji,
} from "./plugins/customEmoji";
import { remarkHtmlToText } from "./plugins/htmlToText";
import {
  RenderMention,
  mentionHandler,
  remarkMentions,
} from "./plugins/mentions";
import { remarkLinkify } from "./plugins/remarkLinkify";
import {
  RenderSpoiler,
  remarkSpoiler,
  spoilerHandler,
} from "./plugins/spoiler";
import {
  RenderTimestamp,
  remarkTimestamps,
  timestampHandler,
} from "./plugins/timestamps";
import {
  RenderUnicodeEmoji,
  remarkUnicodeEmoji,
  unicodeEmojiHandler,
} from "./plugins/unicodeEmoji";
import { remarkInsertBreaks, sanitise } from "./sanitise";
import { childrenToSolid } from "./solid-markdown/ast-to-solid";
import { defaults } from "./solid-markdown/defaults";

/**
 * Empty component
 */
const Null = () => null;

function RenderOrderedList(props: {
  start?: string;
  style?: any;
  [key: string]: any;
}) {
  return (
    <elements.orderedList
      {...props}
      style={{
        ...(props.start
          ? { "--start-number": (parseInt(props.start, 10) - 1).toString() }
          : {}),
        ...props.style,
      }}
    />
  );
}

/**
 * Custom Markdown components
 */
const components = () => ({
  unicodeEmoji: RenderUnicodeEmoji,
  customEmoji: RenderCustomEmoji,
  mention: RenderMention,
  timestamp: RenderTimestamp,
  spoiler: RenderSpoiler,

  a: RenderAnchor,
  p: elements.paragraph,
  em: elements.emphasis,
  strong: elements.strong,
  del: elements.strikethrough,
  h1: elements.heading1,
  h2: elements.heading2,
  h3: elements.heading3,
  h4: elements.heading4,
  h5: elements.heading5,
  h6: elements.heading6,
  pre: RenderCodeblock,
  li: elements.listItem,
  ul: elements.unorderedList,
  ol: RenderOrderedList,
  blockquote: elements.blockquote,
  table: elements.table,
  th: elements.tableHeader,
  td: elements.tableElement,
  code: elements.code,
  time: elements.time,

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
});

const replyComponents = () => ({
  unicodeEmoji: RenderUnicodeEmoji,
  customEmoji: RenderCustomEmoji,
  mention: RenderMention,
  spoiler: RenderSpoiler,

  strong: elements.strong,
  em: elements.emphasis,
  code: elements.code,
  del: elements.strikethrough,

  p: (props: any) => <>{props.children}</>,
  h1: (props: any) => <>{props.children}</>,
  h2: (props: any) => <>{props.children}</>,
  h3: (props: any) => <>{props.children}</>,
  h4: (props: any) => <>{props.children}</>,
  h5: (props: any) => <>{props.children}</>,
  h6: (props: any) => <>{props.children}</>,
  li: (props: any) => <>{props.children}</>,
  ul: (props: any) => <>{props.children}</>,
  ol: (props: any) => <>{props.children}</>,
  blockquote: (props: any) => <>{props.children}</>,
  td: (props: any) => <>{props.children}</>,
  th: (props: any) => <>{props.children}</>,
  time: RenderTimestamp,
  timestamp: RenderTimestamp,
  pre: Null,
  table: Null,
  a: Null,
  img: Null,
  video: Null,
  figure: Null,
  picture: Null,
  source: Null,
  audio: Null,
  script: Null,
  style: Null,
});

/**
 * Unified Markdown renderer
 */
export const unifiedPipeline = unified()
  .use(remarkParse)
  .use(remarkBreaks)
  // .use(remarkGfm)
  .use(remarkMath, {
    // TODO: fork for \[\] support
    singleDollarTextMath: false,
  });

export const UNIFIED_PLUGINS = [
  remarkMentions,
  remarkTimestamps,
  remarkChannels,
  remarkUnicodeEmoji,
  remarkCustomEmoji,
  remarkSpoiler,
  remarkLinkify,
  remarkHtmlToText,
];

const htmlPipeline = UNIFIED_PLUGINS.reduce(
  (pipeline, plugin) => pipeline.use(plugin) as never,
  unifiedPipeline,
)
  // @ts-expect-error non-standard elements not recognised by typing
  .use(remarkRehype, {
    handlers: {
      unicodeEmoji: unicodeEmojiHandler,
      customEmoji: customEmojiHandler,
      mention: mentionHandler,
      timestamp: timestampHandler,
      spoiler: spoilerHandler,
    },
  })
  .use(remarkInsertBreaks)
  .use(rehypeKatex, {
    maxSize: 10,
    maxExpand: 2,
    trust: false,
    strict: false,
    output: "html",
    errorColor: "var(--md-sys-color-error)",
  })
  .use(rehypeHighlight);

const replyPipeline = unified()
  .use(remarkParse)
  .use(remarkBreaks)
  // .use(remarkGfm)
  .use(remarkMentions)
  .use(remarkUnicodeEmoji)
  .use(remarkCustomEmoji)
  .use(remarkSpoiler)
  .use(remarkLinkify)
  // @ts-expect-error non-standard elements not recognized by typing
  .use(remarkRehype, {
    handlers: {
      unicodeEmoji: unicodeEmojiHandler,
      customEmoji: customEmojiHandler,
      mention: mentionHandler,
      spoiler: spoilerHandler,
    },
  })
  .use(remarkInsertBreaks);

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

export function renderSimpleMarkdown(content: string) {
  const file = new VFile();
  file.value = sanitise(content);

  const hastNode = replyPipeline.runSync(replyPipeline.parse(file), file);

  if (hastNode.type !== "root") {
    throw new TypeError("Expected a `root` node");
  }

  return childrenToSolid(
    {
      options: {
        ...defaults,
        // @ts-expect-error it doesn't like the td component
        components: replyComponents(),
      },
      schema: html,
      listDepth: 0,
    },
    hastNode,
  );
}

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

    const hastNode = htmlPipeline.runSync(htmlPipeline.parse(file), file);

    if (hastNode.type !== "root") {
      throw new TypeError("Expected a `root` node");
    }

    injectEmojiSize(props, hastNode as any);

    return childrenToSolid(
      {
        options: {
          ...defaults,
          // @ts-expect-error it doesn't like the td component
          components: components(),
        },
        schema: html,
        listDepth: 0,
      },
      hastNode,
    );
  }

  // Render once immediately
  const [children, setChildren] = createSignal(render(props.content));

  // If it ever updates, re-render the whole tree:
  createEffect(
    on(
      () => props.content,
      (content) => setChildren(render(content)),
      { defer: true },
    ),
  );

  // Give it to Solid:
  return <>{children()}</>;
}
