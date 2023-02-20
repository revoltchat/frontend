import { styled, Typography, Header } from "@revolt/ui";
import { useClient } from "@revolt/client";
import { Navigate, useParams } from "@revolt/routing";
import { Channel } from "revolt.js";

import { Component, createMemo, Match, Switch } from "solid-js";

import { TextWithEmoji } from "@revolt/markdown";
import { TextChannel } from "./text/TextChannel";

/**
 * Channel layout
 */
const Base = styled("div")`
  min-width: 0;
  flex-grow: 1;
  display: flex;
  flex-direction: column;

  background: ${({ theme }) => theme!.colours["background-200"]};
`;

export interface ChannelPageProps {
  channel: Channel;
}

const TEXT_CHANNEL_TYPES: Channel["channel_type"][] = [
  "TextChannel",
  "DirectMessage",
  "Group",
  "SavedMessages",
];

/**
 * Channel component
 */
export const ChannelPage: Component = () => {
  const params = useParams();
  const client = useClient();
  const channel = createMemo(() => client.channels.get(params.channel)!);

  return (
    <Base>
      <Switch fallback="Unknown channel type!">
        <Match when={!channel()}>
          <Navigate href={"../.."} />
        </Match>
        <Match when={TEXT_CHANNEL_TYPES.includes(channel()!.channel_type)}>
          <TextChannel channel={channel()} />
        </Match>
        <Match when={channel()!.channel_type === "VoiceChannel"}>
          <Header palette="primary">
            <TextWithEmoji content={channel().name!} />
          </Header>
          <Typography variant="legacy-modal-title">
            Legacy voice channels are not supported!
          </Typography>
        </Match>
      </Switch>
    </Base>
  );
};
