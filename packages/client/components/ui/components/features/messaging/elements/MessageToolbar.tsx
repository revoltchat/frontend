import { styled } from "styled-system/jsx";

import { Ripple } from "@revolt/ui/components/design";
import { iconSize } from "@revolt/ui/components/utils";

import MdDelete from "@material-design-icons/svg/outlined/delete.svg?component-solid";
import MdEmojiEmotions from "@material-design-icons/svg/outlined/emoji_emotions.svg?component-solid";
import MdReply from "@material-design-icons/svg/outlined/reply.svg?component-solid";

export function MessageToolbar() {
  return (
    <Base class="Toolbar">
      <Tool>
        <Ripple />
        <MdReply {...iconSize(20)} />
      </Tool>
      <Tool>
        <Ripple />
        <MdEmojiEmotions {...iconSize(20)} />
      </Tool>
      <Tool>
        <Ripple />
        <MdDelete {...iconSize(20)} />
      </Tool>
    </Base>
  );
}

const Base = styled("div", {
  base: {
    top: "-18px",
    right: "16px",
    position: "absolute",

    display: "none",
    overflow: "hidden",
    borderRadius: "var(--borderRadius-xs)",
    boxShadow: "0 0 3px var(--md-sys-color-shadow)",
  },
});

const Tool = styled("div", {
  base: {
    position: "relative",

    cursor: "pointer",

    padding: "var(--gap-sm)",
    fill: "var(--md-sys-color-on-secondary-container)",
    background: "var(--md-sys-color-secondary-container)",
  },
});
