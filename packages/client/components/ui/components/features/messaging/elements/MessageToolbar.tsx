import { Message } from "revolt.js";
import { styled } from "styled-system/jsx";

import { useUser } from "@revolt/client";
import { useState } from "@revolt/state";
import { Ripple } from "@revolt/ui/components/design";
import { iconSize } from "@revolt/ui/components/utils";

import MdDelete from "@material-design-icons/svg/outlined/delete.svg?component-solid";
import MdEmojiEmotions from "@material-design-icons/svg/outlined/emoji_emotions.svg?component-solid";
import MdReply from "@material-design-icons/svg/outlined/reply.svg?component-solid";

export function MessageToolbar(props: { message: Message }) {
  const user = useUser();
  const state = useState();

  // todo: a11y for buttons; tabindex

  return (
    <Base class="Toolbar">
      <Tool onClick={() => state.draft.addReply(props.message, user()!.id)}>
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

const Tool = styled("a", {
  base: {
    position: "relative",

    cursor: "pointer",

    padding: "var(--gap-sm)",
    fill: "var(--md-sys-color-on-secondary-container)",
    background: "var(--md-sys-color-secondary-container)",
  },
});
