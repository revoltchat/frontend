import { For, Match, Show, Switch } from "solid-js";

import { Trans } from "@lingui-solid/solid/macro";
import dayjs from "dayjs";
import { Channel } from "revolt.js";

import { useModals } from "@revolt/modal";
import { useState } from "@revolt/state";
import { Column, Text, Time } from "@revolt/ui";

import MdAlternateEmail from "@material-design-icons/svg/outlined/alternate_email.svg?component-solid";
import MdBadge from "@material-design-icons/svg/outlined/badge.svg?component-solid";
import MdDelete from "@material-design-icons/svg/outlined/delete.svg?component-solid";
import MdGroupAdd from "@material-design-icons/svg/outlined/group_add.svg?component-solid";
import MdLibraryAdd from "@material-design-icons/svg/outlined/library_add.svg?component-solid";
import MdLogout from "@material-design-icons/svg/outlined/logout.svg?component-solid";
import MdMarkChatRead from "@material-design-icons/svg/outlined/mark_chat_read.svg?component-solid";
import MdNotificationsActive from "@material-design-icons/svg/outlined/notifications_active.svg?component-solid";
import MdNotificationsOff from "@material-design-icons/svg/outlined/notifications_off.svg?component-solid";
import MdSettings from "@material-design-icons/svg/outlined/settings.svg?component-solid";
import MdShare from "@material-design-icons/svg/outlined/share.svg?component-solid";
import MdShield from "@material-design-icons/svg/outlined/shield.svg?component-solid";

import MdDoNotDisturbOff from "@material-symbols/svg-400/outlined/do_not_disturb_off.svg?component-solid";
import MdDoNotDisturbOn from "@material-symbols/svg-400/outlined/do_not_disturb_on.svg?component-solid";
import MdNotificationSettings from "@material-symbols/svg-400/outlined/notification_settings.svg?component-solid";
import MdRadioButtonChecked from "@material-symbols/svg-400/outlined/radio_button_checked-fill.svg?component-solid";
import MdRadioButtonUnchecked from "@material-symbols/svg-400/outlined/radio_button_unchecked.svg?component-solid";

import {
  ContextMenu,
  ContextMenuButton,
  ContextMenuDivider,
  ContextMenuSubMenu,
} from "./ContextMenu";

/**
 * Context menu for channels
 */
export function ChannelContextMenu(props: { channel: Channel }) {
  const state = useState();
  const { openModal } = useModals();

  /**
   * Mark channel as read
   */
  function markAsRead() {
    props.channel.ack();
  }

  /**
   * Create a new invite
   */
  function createInvite() {
    openModal({
      type: "create_invite",
      channel: props.channel,
    });
  }

  /**
   * Create a new channel
   */
  function createChannel() {
    openModal({
      type: "create_channel",
      server: props.channel.server!,
    });
  }

  /**
   * Edit channel
   */
  function editChannel() {
    openModal({
      type: "settings",
      config: "channel",
      context: props.channel,
    });
  }

  /**
   * Delete channel
   */
  function deleteChannel() {
    openModal({
      type: "delete_channel",
      channel: props.channel,
    });
  }

  /**
   * Open channel in Revolt Admin Panel
   */
  function openAdminPanel() {
    window.open(
      `https://admin.revolt.chat/panel/inspect/channel/${props.channel.id}`,
      "_blank",
    );
  }

  /**
   * Copy channel link to clipboard
   */
  function copyLink() {
    navigator.clipboard.writeText(
      `${location.origin}${
        props.channel.server ? `/server/${props.channel.server?.id}` : ""
      }/channel/${props.channel.id}`,
    );
  }

  /**
   * Copy channel id to clipboard
   */
  function copyId() {
    navigator.clipboard.writeText(props.channel.id);
  }

  return (
    <ContextMenu>
      <Show
        when={
          props.channel.unread || props.channel.havePermission("InviteOthers")
        }
      >
        <Show when={props.channel.unread}>
          <ContextMenuButton icon={MdMarkChatRead} onClick={markAsRead}>
            <Trans>Mark as read</Trans>
          </ContextMenuButton>
        </Show>
        <Show when={props.channel.havePermission("InviteOthers")}>
          <ContextMenuButton icon={MdGroupAdd} onClick={createInvite}>
            <Trans>Create invite</Trans>
          </ContextMenuButton>
        </Show>
        <ContextMenuDivider />
      </Show>

      <Show
        when={!state.notifications.isChannelMuted(props.channel)}
        fallback={
          <ContextMenuButton
            onClick={() =>
              state.notifications.setChannelMute(props.channel, undefined)
            }
            symbol={MdDoNotDisturbOff}
            _titleCase={false}
          >
            <Column gap="none">
              <Trans>Unmute Channel</Trans>
              <Show
                when={state.notifications.getChannelMute(props.channel)?.until}
              >
                <Text class="label" size="small">
                  <Trans>
                    Muted until{" "}
                    <Time
                      format="datetime"
                      value={
                        state.notifications.getChannelMute(props.channel)!.until
                      }
                    />
                  </Trans>
                </Text>
              </Show>
            </Column>
          </ContextMenuButton>
        }
      >
        <ContextMenuSubMenu
          onClick={() => state.notifications.setChannelMute(props.channel, {})}
          buttonContent={<Trans>Mute Channel</Trans>}
          symbol={MdDoNotDisturbOn}
        >
          <For
            each={
              [
                [15, <Trans>For 15 minutes</Trans>],
                [60, <Trans>For 1 hour</Trans>],
                [180, <Trans>For 3 hours</Trans>],
                [480, <Trans>For 8 hours</Trans>],
                [1440, <Trans>For 24 hours</Trans>],
                [undefined, <Trans>Until I turn it back on</Trans>],
              ] as const
            }
          >
            {([timeMin, i18n]) => (
              <ContextMenuButton
                onClick={() =>
                  state.notifications.setChannelMute(props.channel, {
                    until: timeMin
                      ? +dayjs().add(timeMin, "minutes")
                      : undefined,
                  })
                }
                _titleCase={false}
              >
                {i18n}
              </ContextMenuButton>
            )}
          </For>
        </ContextMenuSubMenu>
      </Show>

      <ContextMenuSubMenu
        symbol={MdNotificationSettings}
        buttonContent={<Trans>Notifications</Trans>}
      >
        <Show when={props.channel.server}>
          <ContextMenuButton
            onClick={() =>
              state.notifications.setChannel(props.channel, undefined)
            }
            actionSymbol={
              typeof state.notifications.getChannel(props.channel) ===
              "undefined"
                ? MdRadioButtonChecked
                : MdRadioButtonUnchecked
            }
          >
            <Column gap="none">
              <Trans>Server Default</Trans>
              <Text class="label" size="small">
                <Switch fallback={<Trans>None</Trans>}>
                  <Match
                    when={
                      state.notifications.computeForServer(
                        props.channel.server!,
                      ) === "all"
                    }
                  >
                    <Trans>All Messages</Trans>
                  </Match>
                  <Match
                    when={
                      state.notifications.computeForServer(
                        props.channel.server!,
                      ) === "mention"
                    }
                  >
                    <Trans>Mentions Only</Trans>
                  </Match>
                </Switch>
              </Text>
            </Column>
          </ContextMenuButton>
        </Show>
        <ContextMenuButton
          icon={MdNotificationsActive}
          onClick={() => state.notifications.setChannel(props.channel, "all")}
          actionSymbol={
            state.notifications.getChannel(props.channel) === "all"
              ? MdRadioButtonChecked
              : MdRadioButtonUnchecked
          }
        >
          <Trans>All Messages</Trans>
        </ContextMenuButton>
        <ContextMenuButton
          icon={MdAlternateEmail}
          onClick={() =>
            state.notifications.setChannel(props.channel, "mention")
          }
          actionSymbol={
            state.notifications.getChannel(props.channel) === "mention"
              ? MdRadioButtonChecked
              : MdRadioButtonUnchecked
          }
        >
          <Trans>Mentions Only</Trans>
        </ContextMenuButton>
        <ContextMenuButton
          icon={MdNotificationsOff}
          onClick={() => state.notifications.setChannel(props.channel, "none")}
          actionSymbol={
            state.notifications.getChannel(props.channel) === "none"
              ? MdRadioButtonChecked
              : MdRadioButtonUnchecked
          }
        >
          <Trans>None</Trans>
        </ContextMenuButton>
      </ContextMenuSubMenu>
      <ContextMenuDivider />

      <Show when={props.channel.server?.havePermission("ManageChannel")}>
        <ContextMenuButton icon={MdLibraryAdd} onClick={createChannel}>
          <Trans>Create channel</Trans>
        </ContextMenuButton>
      </Show>
      <Show when={props.channel.havePermission("ManageChannel")}>
        <ContextMenuButton icon={MdSettings} onClick={editChannel}>
          <Trans>Open channel settings</Trans>
        </ContextMenuButton>
        <ContextMenuButton
          icon={props.channel.type === "Group" ? MdLogout : MdDelete}
          onClick={deleteChannel}
          destructive
        >
          <Switch fallback={<Trans>Delete channel</Trans>}>
            <Match when={props.channel.type === "Group"}>
              <Trans>Leave group</Trans>
            </Match>
          </Switch>
        </ContextMenuButton>
      </Show>

      <Show
        when={
          props.channel.server?.havePermission("ManageChannel") ||
          props.channel.havePermission("ManageChannel")
        }
      >
        <ContextMenuDivider />
      </Show>

      <Show when={state.settings.getValue("advanced:admin_panel")}>
        <ContextMenuButton icon={MdShield} onClick={openAdminPanel}>
          <Trans>Admin Panel</Trans>
        </ContextMenuButton>
      </Show>
      <ContextMenuButton icon={MdShare} onClick={copyLink}>
        <Trans>Copy link</Trans>
      </ContextMenuButton>
      <Show when={state.settings.getValue("advanced:copy_id")}>
        <ContextMenuButton icon={MdBadge} onClick={copyId}>
          <Trans>Copy channel ID</Trans>
        </ContextMenuButton>
      </Show>
    </ContextMenu>
  );
}
