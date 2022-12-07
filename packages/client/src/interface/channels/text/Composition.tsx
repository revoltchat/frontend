import { MessageBox } from "@revolt/ui";
import { Channel } from "revolt.js";
import { createSignal } from "solid-js";

interface Props {
  channel: Channel;
}

/**
 * Message composition engine
 */
export function MessageComposition(props: Props) {
  const [content, setContent] = createSignal("");

  return (
    <MessageBox channel={props.channel} content={content} setContent={setContent} />
  );
}
