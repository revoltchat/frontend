import { styled } from "solid-styled-components";
import emojiRegex from "emoji-regex";

import { createComponent, CustomComponentProps } from "./remarkRegexComponent";

export const Emoji = styled.img`
  object-fit: contain;

  display: inline;
  width: var(--emoji-size);
  height: var(--emoji-size);
  margin: 0 0.05em 0 0.1em;
  vertical-align: -0.3em;

  img:before {
    content: " ";
    display: block;
    position: absolute;
    height: 50px;
    width: 50px;
    background-image: url(ishere.jpg);
  }
`;

/**
 * Function provided under the MIT License
 * Copyright (c) 2016-20 Ionică Bizău <bizauionica@gmail.com> (https://ionicabizau.net)
 * https://github.com/IonicaBizau/emoji-unicode/blob/master/LICENSE
 */
function toCodepoint(input: string) {
  if (input.length === 1) {
    return input.charCodeAt(0).toString(16);
  } else if (input.length > 1) {
    const pairs = [];
    for (var i = 0; i < input.length; i++) {
      if (
        // high surrogate
        input.charCodeAt(i) >= 0xd800 &&
        input.charCodeAt(i) <= 0xdbff
      ) {
        if (
          input.charCodeAt(i + 1) >= 0xdc00 &&
          input.charCodeAt(i + 1) <= 0xdfff
        ) {
          // low surrogate
          pairs.push(
            (input.charCodeAt(i) - 0xd800) * 0x400 +
              (input.charCodeAt(i + 1) - 0xdc00) +
              0x10000
          );
        }
      } else if (input.charCodeAt(i) < 0xd800 || input.charCodeAt(i) > 0xdfff) {
        // modifiers and joiners
        pairs.push(input.charCodeAt(i));
      }
    }

    return pairs.map((char) => char.toString(16)).join("-");
  }

  return "";
}

export function RenderUnicodeEmoji(props: CustomComponentProps) {
  return (
    <Emoji
      loading="lazy"
      class="emoji"
      alt={props.str}
      draggable={false}
      src={`https://static.revolt.chat/emoji/fluent-3d/${toCodepoint(
        props.str
      )}.svg?v=1`}
    />
  );
}

export const remarkUnicodeEmoji = createComponent("uemoji", emojiRegex());
