/* @refresh reload */

/**
 * Configure contexts and render App
 */
import { render } from "solid-js/web";

import { Markdown } from "@revolt/markdown";
import { ThemeProvider, darkTheme, styled } from "@revolt/ui";
import "@revolt/ui/styles";

const MdArticle = `Revolt uses a simple, plain-text based, and super easy text formatting system called [**Markdown**](https://en.wikipedia.org/wiki/Markdown).  
You can use it to **make your text stand out**!

## Custom Extensions

Channel link: <#01F7ZSBSFHCAAJQ92ZGTY67HMN>

User mention: <@01EX2NCWQ0CHS3QJF0FEQS1GR4>

## Basic Styles

| Style              | Markdown                                             |
| ------------------ | ---------------------------------------------------- |
| **bold**           | \\*\\*bold\\*\\* or \\_\\_bold\\_\\_                         |
| _italics_          | \\*italics\\* or \\_italics\\_                           |
| **_bold italics_** | \\*\\*\\*bold italics\\*\\*\\* or \\_\\_\\_bold italics\\_\\_\\_ |
| ~~strikethrough~~  | \\~\\~strikethrough\\~\\~                                |

## Code Blocks

You can use code blocks for text that needs to be easily copied, such as code.

### Single-line Code Block

| Style                               | Markdown                              |
| ----------------------------------- | ------------------------------------- |
| \`This is a single-line code block!\` | \\\`This is a single-line code block!\\\` |


### Multi-line Code Block

\`\`\`
This is a multi-line code block!
\`\`\`

\`\`\`js
let x = "This is a multi-line code block, with the language set to JS";
\`\`\`


## Block Quotes

You can use Block Quotes to signify a quote. The block quote can be multiple levels deep.

> > If you change the way you look at things, the things you look at change.
>
> — Wayne Dyer  
> trash can sus

## Spoilers

You can hide spoilers using spoiler tags.

Simply **wrap your spoiler in two exclamation marks before and after**, and the text will only be revealed after an additional click.

The impostor is !!jan!!

## Links

You can embed links in regular text: [Revolt](https://revolt.chat)

## Headings

You can add headings to your messages. The lower the heading number, the larger the text. The smallest heading is 6.


# Heading 1

## Heading 2

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6


## Tables

You can create tables in your messages.


| Header 1 | Header 2 | Header 3 |
| :------- | :------- | :------- |
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
| Cell 7   | Cell 8   | Cell 9   |



## Lists

You can create lists in your messages, such as unordered lists (\`*\`, \`+\`, \`-\`) and ordered lists (\`1.\`, \`2.\`, \`3.\`).


-   Item 1
-   Item 2
-   Item 3

1. Item 1
2. Item 2
3. Item 3



## KaTeX

You can use KaTeX to render math and some other advanced markup in your messages.

| Examples                         |
| -------------------------------- |
| $x^2$                            |
| $\\sin(x)$                       |
| $\\frac{x}{y}$                   |
| $\\sqrt{x^2}$                    |
| $\\sum_{i=1}^n a_i$              |
| $\\lim_{x \\to \\infty}$         |
| $\\color{red}\\textsf{Red Text}$ |

See [KaTeX's documentation](https://katex.org/docs/supported.html) for more information.

## Timestamps

You can display timestamps in your messages. The format requires you to get the time as a Unix timestamp. You can do this with online services like [unixtimestamp.com](https://www.unixtimestamp.com/).

![An embedded timestamp in a message.](/content/articles/interface/messages/formatting-your-messages/timestamps.png)

| Examples         |
| ---------------- |
| <t:1663846662:t> |
| <t:1663846662:T> |
| <t:1663846662:D> |
| <t:1663846662:f> |
| <t:1663846662:F> |
| <t:1663846662:R> |

## Emoji

You can use emoji in your messages. This allows you to express yourself in a more human way.

| Style                                                          | Markdown                         |
| -------------------------------------------------------------- | -------------------------------- |
| ![🤠](https://static.revolt.chat/emoji/mutant/1f920.svg?rev=3) | :cowboy_hat_face:                |
| ![😳](https://static.revolt.chat/emoji/mutant/1f633.svg?rev=3) | :flushed:                        |
| ![😍](https://static.revolt.chat/emoji/mutant/1f60d.svg?rev=3) | :heart_eyes:                     |
| ![🥰](https://static.revolt.chat/emoji/mutant/1f970.svg?rev=3) | :smiling_face_with_three_hearts: |

You can see the full list of emoji shortcodes using auto-completion - simply start typing with a \`:\`.
`;

const Container = styled.div`
  padding: 1em;
  color: ${(props) => props.theme!.colours["foreground"]};
  background: ${(props) => props.theme!.colours["background-100"]};
`;

render(() => {
  return (
    <ThemeProvider theme={darkTheme()}>
      <Container>
        <Markdown content={MdArticle} />
      </Container>
    </ThemeProvider>
  );
}, document.getElementById("mdRoot") as HTMLElement);
