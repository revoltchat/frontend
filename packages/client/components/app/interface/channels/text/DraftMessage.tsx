import { For } from "solid-js";

import { Trans } from "@lingui-solid/solid/macro";
import type { Channel } from "revolt.js";

import { useClient, useUser } from "@revolt/client";
import { userInformation } from "@revolt/markdown/users";
import type { UnsentMessage } from "@revolt/state/stores/Draft";
import { Avatar, MessageContainer, MessageReply, Username } from "@revolt/ui";

import { DraftMessageContextMenu } from "../../../menus/DraftMessageContextMenu";

interface Props {
  draft: UnsentMessage;
  channel: Channel;
  tail?: boolean;
}

/**
 * Unsent message preview
 */
export function DraftMessage(props: Props) {
  const client = useClient();
  const user = useUser();
  const userInfo = () => userInformation(user(), props.channel.server?.member);

  return (
    <MessageContainer
      tail={props.tail}
      avatar={<Avatar src={userInfo().avatar} size={36} />}
      children={props.draft.content}
      timestamp={
        props.draft.status === "sending" ? (
          <Trans>Sending...</Trans>
        ) : props.draft.status === "failed" ? (
          <Trans>Failed to send</Trans>
        ) : (
          <Trans>Unsent message</Trans>
        )
      }
      sendStatus={props.draft.status === "sending" ? "sending" : "failed"}
      username={<Username username={userInfo().username} />}
      header={
        <For each={props.draft.replies}>
          {(reply) => (
            <MessageReply
              message={client().messages.get(reply.id)}
              mention={reply.mention}
            />
          )}
        </For>
      }
      contextMenu={() => (
        <DraftMessageContextMenu draft={props.draft} channel={props.channel} />
      )}
    />
  );
}
