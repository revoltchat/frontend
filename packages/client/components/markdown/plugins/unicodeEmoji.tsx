import emojiRegex from "emoji-regex";

import { UnicodeEmoji } from "../emoji";

import { CustomComponentProps, createComponent } from "./remarkRegexComponent";

/**
 * Render Unicode emoji
 */
export function RenderUnicodeEmoji(props: CustomComponentProps) {
  return <UnicodeEmoji emoji={props.str} />;
}

export const remarkUnicodeEmoji = createComponent("uemoji", emojiRegex());
