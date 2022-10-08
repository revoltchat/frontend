import { MessageBox } from "@revolt/ui";
import { Channel } from "revolt.js";
import { Accessor, createSignal } from "solid-js";

interface Props {
  channel: Accessor<Channel>;
}

/**
 * Message composition engine
 */
export function MessageComposition({ channel }: Props) {
  const [content, setContent] = createSignal("");

  return (
    <MessageBox channel={channel} content={content} setContent={setContent} />
  );
}
