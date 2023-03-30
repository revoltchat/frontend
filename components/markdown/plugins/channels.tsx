import { clientController } from "@revolt/client";
import { Link } from "@revolt/routing";

import { CustomComponentProps, createComponent } from "./remarkRegexComponent";

export function RenderChannel(props: CustomComponentProps) {
  const channel = clientController.getAvailableClient().channels.get(props.match)!;

  return (
    <Link
      href={`${
        channel.server_id ? `/server/${channel.server_id}` : ""
      }/channel/${props.match}`}
    >{`#${channel.name}`}</Link>
  );
}

export const remarkChannels = createComponent(
  "channel",
  /<#([A-z0-9]{26})>/g,
  (match) => clientController.getAvailableClient()?.channels.has(match)
);
