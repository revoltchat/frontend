import { clientController, useClient } from "@revolt/client";
import { Link } from "@revolt/routing";

import { CustomComponentProps, createComponent } from "./remarkRegexComponent";

export function RenderChannel(props: CustomComponentProps) {
  const client = useClient();
  const channel = () => client().channels.get(props.match)!;

  return (
    <Link
      href={`${
        channel().serverId ? `/server/${channel().serverId}` : ""
      }/channel/${props.match}`}
    >{`#${channel().name}`}</Link>
  );
}

export const remarkChannels = createComponent(
  "channel",
  /<#([A-z0-9]{26})>/g,
  (match) => clientController.getCurrentClient()!.channels.has(match)
);
