import { TextWithEmoji } from "@revolt/markdown";
import { HeaderWithTransparency } from "@revolt/ui";
import { createEffect } from "solid-js";
import { ChannelPageProps } from "../ChannelPage";
import { MessageComposition } from "./Composition";
import { Messages } from "./Messages";

/**
 * Channel component
 */
export function TextChannel(props: ChannelPageProps) {
  createEffect(() => {
    // channel()._id
    // setLastId
  });

  return (
    <>
      <HeaderWithTransparency palette="primary">
        <TextWithEmoji content={props.channel.name!} />
      </HeaderWithTransparency>
      <Messages channel={props.channel} />
      <MessageComposition channel={props.channel} />
    </>
  );
}
