import { BiRegularAt, BiRegularHash, BiSolidNotepad } from "solid-icons/bi";
import { Match, Show, Switch } from "solid-js";

import { Trans, useLingui } from "@lingui-solid/solid/macro";
import { Channel } from "revolt.js";
import { css } from "styled-system/css";
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
  typography,
} from "@revolt/ui";

import MdCall from "@material-design-icons/svg/outlined/call.svg?component-solid";
import MdGroup from "@material-design-icons/svg/outlined/group.svg?component-solid";
import MdPersonAdd from "@material-design-icons/svg/outlined/person_add.svg?component-solid";
import MdSettings from "@material-design-icons/svg/outlined/settings.svg?component-solid";

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
  const { t } = useLingui();
  const state = useState();
  const rtc = useVoice();

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
            <a
              class={descriptionLink}
              onClick={() =>
                openModal({
                  type: "channel_info",
                  channel: props.channel,
                })
              }
              use:floating={{
                tooltip: {
                  placement: "bottom",
                  content: t`Click to show full description`,
                },
              }}
            >
              <OverflowingText
                class={typography({ class: "title", size: "small" })}
              >
                <TextWithEmoji
                  content={props.channel.description?.split("\n").shift()}
                />
              </OverflowingText>
            </a>
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

      <Show
        when={import.meta.env.DEV && props.channel.type !== "SavedMessages"}
      >
        <Button
          variant="plain"
          size="icon"
          onPress={joinCall}
          use:floating={{
            tooltip: {
              placement: "bottom",
              content: t`Join call`,
            },
          }}
        >
          <MdCall />
        </Button>
      </Show>

      <Show
        when={
          props.channel.type === "Group" ||
          props.channel.orPermission("ManageChannel", "ManagePermissions")
        }
      >
        <Button
          variant="plain"
          size="icon"
          onPress={() =>
            openModal({
              type: "settings",
              config: "channel",
              context: props.channel,
            })
          }
          use:floating={{
            tooltip: {
              placement: "bottom",
              content: t`Channel settings`,
            },
          }}
        >
          <MdSettings />
        </Button>
      </Show>

      <Show when={props.channel.type === "Group"}>
        <Button
          variant="plain"
          size="icon"
          onPress={() =>
            openModal({
              type: "add_members_to_group",
              group: props.channel,
              client: client(),
            })
          }
          use:floating={{
            tooltip: {
              placement: "bottom",
              content: t`Add friends to group`,
            },
          }}
        >
          <MdPersonAdd />
        </Button>
      </Show>

      <Button
        variant="plain"
        size="icon"
        onPress={() =>
          state.layout.toggleSectionState(LAYOUT_SECTIONS.MEMBER_SIDEBAR, true)
        }
        use:floating={{
          tooltip: {
            placement: "bottom",
            content: t`View members`,
          },
        }}
      >
        <MdGroup />
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
const descriptionLink = css({
  minWidth: 0,
});
