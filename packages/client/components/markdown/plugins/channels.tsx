import { clientController, useClient } from "@revolt/client";

import {
  CustomComponentProps,
  createRegexComponent,
} from "./remarkRegexComponent";

export function RenderChannel(props: CustomComponentProps) {
  const client = useClient();
  const channel = () => client().channels.get(props.match)!;

  return (
    <a
      href={`${
        channel().serverId ? `/server/${channel().serverId}` : ""
      }/channel/${props.match}`}
    >{`#${channel().name}`}</a>
  );
}

export const remarkChannels = createRegexComponent(
  "channel",
  /<#([A-z0-9]{26})>/g,
  (match) => clientController.getCurrentClient()!.channels.has(match)
);
