import { Component, onCleanup, onMount } from "solid-js";

import { useClient } from "@revolt/client";
import { KeybindEventHandler } from "@revolt/keybinds";
import { useSmartParams } from "@revolt/routing";
import { useNavigate } from "@revolt/routing";
import { state } from "@revolt/state";
import { KeybindAction } from "@revolt/state/stores/Keybinds";

export const KeybindHandler: Component = () => {
  const handler = new KeybindEventHandler<KeybindAction>(() =>
    state.keybinds.getKeybinds()
  );
  const navigate = useNavigate();
  const params = useSmartParams();
  const client = useClient();

  // TODO: this does not filter visible channels at the moment because the state for categories is not stored anywhere
  const visibleChannels = (serverId: string) =>
    client()
      .servers.get(serverId)
      ?.orderedChannels.flatMap((category) => category.channels);

  // TODO: issue warning if nothing is found somehow? warnings can be nicer than flat out not working
  // TODO: we want it to feel smooth when navigating through channels, so we'll want to select channels immediately but not actually navigate until we're done moving through them
  const navigateChannel = (byOffset: number) => {
    const { serverId, channelId } = params();

    if (serverId == null || channelId == null) {
      return;
    }

    const channels = visibleChannels(serverId);

    if (channels == null) {
      return;
    }

    const currentChannelIndex = channels.findIndex(
      (channel) => channel.id === channelId
    );

    // this will wrap the index around
    const nextChannel = channels.at(
      (currentChannelIndex + byOffset) % channels.length
    );

    if (nextChannel) {
      navigate(`/server/${serverId}/channel/${nextChannel?.id}`);
    }
  };

  const navigateChannelUp = () => navigateChannel(-1);
  const navigateChannelDown = () => navigateChannel(1);

  onMount(() => {
    document.addEventListener("keydown", handler);
    handler.addEventListener(
      KeybindAction.NavigateChannelUp,
      navigateChannelUp
    );
    handler.addEventListener(
      KeybindAction.NavigateChannelDown,
      navigateChannelDown
    );
  });

  onCleanup(() => {
    document.removeEventListener("keydown", handler);
    handler.removeEventListener(
      KeybindAction.NavigateChannelUp,
      navigateChannelUp
    );
    handler.removeEventListener(
      KeybindAction.NavigateChannelDown,
      navigateChannelDown
    );
  });

  return <></>;
};
