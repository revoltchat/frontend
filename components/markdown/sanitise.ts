/**
 * Regex for matching execessive recursion of blockquotes and lists
 */
const RE_RECURSIVE = /(^(?:[>*+-][^\S\r\n]*){5})(?:[>*+-][^\S\r\n]*)+(.*$)/gm;

/**
 * Regex for matching multi-line blockquotes
 */
const RE_BLOCKQUOTE = /^([^\S\r\n]*>[^\n]+\n?)+/gm;

/**
 * Regex for matching HTML tags
 */
const RE_HTML_TAGS = /^(<\/?[a-zA-Z0-9]+>)(.*$)/gm;

/**
 * Regex for matching empty lines
 */
const RE_EMPTY_LINE = /^\s*?$/gm;

/**
 * Regex for matching line starting with plus
 */
const RE_PLUS = /^\s*\+(?:$|[^+])/gm;

/**
 * Sanitise Markdown input before rendering
 * @param content Input string
 * @returns Sanitised string
 */
export function sanitise(content: string) {
  return (
    content
      // Strip excessive blockquote or list indentation
      .replace(RE_RECURSIVE, (_, m0, m1) => m0 + m1)

      // Append empty character if string starts with html tag
      // This is to avoid inconsistencies in rendering Markdown inside/after HTML tags
      // https://github.com/revoltchat/revite/issues/733
      .replace(RE_HTML_TAGS, (match) => `\u200E${match}`)

      // Append empty character if line starts with a plus
      // which would usually open a new list but we want
      // to avoid that behaviour in our case.
      .replace(RE_PLUS, (match) => `\u200E${match}`)

      // Replace empty lines with non-breaking space
      // because remark renderer is collapsing empty
      // or otherwise whitespace-only lines of text
      .replace(RE_EMPTY_LINE, "‎\n")

      // Ensure empty line after blockquotes for correct rendering
      .replace(RE_BLOCKQUOTE, (match) => `${match}\n`)
  );
}
