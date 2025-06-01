import {
  BiRegularAt,
  BiRegularHash,
  BiSolidCog,
  BiSolidGroup,
  BiSolidNotepad,
} from "solid-icons/bi";
import { Match, Show, Switch } from "solid-js";

import { Trans } from "@lingui-solid/solid/macro";
import { Channel } from "revolt.js";
import { styled } from "styled-system/jsx";

import { useClient } from "@revolt/client";
import { TextWithEmoji } from "@revolt/markdown";
import { useModals } from "@revolt/modal";
import { useVoice } from "@revolt/rtc";
import { useState } from "@revolt/state";
import { LAYOUT_SECTIONS } from "@revolt/state/stores/Layout";
import {
  Button,
  NonBreakingText,
  OverflowingText,
  Spacer,
  UserStatus,
  iconSize,
  typography,
} from "@revolt/ui";

import MdCall from "@material-design-icons/svg/outlined/call.svg?component-solid";

import { HeaderIcon } from "../common/CommonHeader";

interface Props {
  /**
   * Channel to render header for
   */
  channel: Channel;
}

/**
 * Common channel header component
 */
export function ChannelHeader(props: Props) {
  const { openModal } = useModals();
  const client = useClient();
  const state = useState();
  const rtc = useVoice();

  /**
   * Open channel information modal
   */
  function openChannelInfo() {
    openModal({
      type: "channel_info",
      channel: props.channel,
    });
  }

  /**
   * Open channel settings
   */
  function openChannelSettings() {
    openModal({
      type: "settings",
      config: "channel",
      context: props.channel,
    });
  }

  /**
   * Join voice call
   */
  async function joinCall() {
    const [h, v] = client()!.authenticationHeader;

    const { token, url } = await fetch(
      client()!.api.config.baseURL + `/channels/${props.channel.id}/join_call`,
      {
        method: "POST",
        headers: {
          [h]: v,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ node: "worldwide" }),
      },
    ).then((r) => r.json());

    if (token && url) {
      rtc.connect(url, token);
    }
  }

  return (
    <>
      <Switch>
        <Match
          when={
            props.channel.type === "TextChannel" ||
            props.channel.type === "VoiceChannel" ||
            props.channel.type === "Group"
          }
        >
          <HeaderIcon>
            <BiRegularHash size={24} />
          </HeaderIcon>
          <NonBreakingText
            class={typography({ class: "title", size: "medium" })}
          >
            <TextWithEmoji content={props.channel.name!} />
          </NonBreakingText>
          <Show when={props.channel.description}>
            <Divider />
            <DescriptionLink onClick={openChannelInfo}>
              <OverflowingText
                class={typography({ class: "title", size: "small" })}
              >
                <TextWithEmoji
                  content={props.channel.description?.split("\n").shift()}
                />
              </OverflowingText>
            </DescriptionLink>
          </Show>
        </Match>
        <Match when={props.channel.type === "DirectMessage"}>
          <HeaderIcon>
            <BiRegularAt size={24} />
          </HeaderIcon>
          <TextWithEmoji content={props.channel.recipient?.username} />
          <UserStatus status={props.channel.recipient?.presence} size="8px" />
        </Match>
        <Match when={props.channel.type === "SavedMessages"}>
          <HeaderIcon>
            <BiSolidNotepad size={24} />
          </HeaderIcon>
          <Trans>Saved Notes</Trans>
        </Match>
      </Switch>

      <Spacer />

      <Show when={props.channel.type !== "SavedMessages"}>
        <Button variant="plain" size="icon" onPress={joinCall}>
          <MdCall {...iconSize(24)} />
        </Button>
      </Show>

      <Show
        when={
          props.channel.type === "Group" ||
          props.channel.orPermission("ManageChannel", "ManagePermissions")
        }
      >
        <Button variant="plain" size="icon" onPress={openChannelSettings}>
          <BiSolidCog size={24} />
        </Button>
      </Show>

      <Button
        variant="plain"
        size="icon"
        onPress={() =>
          state.layout.toggleSectionState(LAYOUT_SECTIONS.MEMBER_SIDEBAR, true)
        }
      >
        <BiSolidGroup size={24} />
      </Button>
    </>
  );
}

/**
 * Vertical divider between name and topic
 */
const Divider = styled("div", {
  base: {
    height: "20px",
    margin: "0px 5px",
    paddingLeft: "1px",
    backgroundColor: "var(--colours-messaging-channel-header-divider)",
  },
});

/**
 * Link for the description
 */
const DescriptionLink = styled("a", {
  base: {
    minWidth: 0,
  },
});
