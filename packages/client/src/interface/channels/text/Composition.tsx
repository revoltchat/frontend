import { state } from "@revolt/state";
import { MessageBox } from "@revolt/ui";
import { Channel } from "revolt.js";

interface Props {
  channel: Channel;
}

/**
 * Message composition engine
 */
export function MessageComposition(props: Props) {
  return (
    <MessageBox
      channel={props.channel}
      content={() => state.draft.getDraft(props.channel._id)?.content ?? ""}
      setContent={(content) =>
        state.draft.setDraft(props.channel._id, { content })
      }
    />
  );
}
