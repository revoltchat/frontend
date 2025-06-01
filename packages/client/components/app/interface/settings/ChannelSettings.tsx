import {
  BiRegularListUl,
  BiSolidCloud,
  BiSolidInfoCircle,
  BiSolidTrash,
} from "solid-icons/bi";

import { Trans } from "@lingui-solid/solid/macro";
import { Channel } from "revolt.js";

import { useClient } from "@revolt/client";
import { TextWithEmoji } from "@revolt/markdown";
import { useModals } from "@revolt/modal";
import { ColouredText } from "@revolt/ui";

import { SettingsConfiguration } from ".";
import ChannelOverview from "./channel/Overview";
import Webhooks, { Webhook } from "./channel/Webhooks";
import { ChannelPermissionsEditor } from "./channel/permissions/ChannelPermissionsEditor";

const Config: SettingsConfiguration<Channel> = {
  /**
   * Page titles
   */
  title(ctx, key) {
    const client = useClient();

    if (key.startsWith("webhooks/")) {
      const webhook = client().channelWebhooks.get(key.substring(9));
      return webhook!.name;
    }

    return ctx.entries
      .flatMap((category) => category.entries)
      .find((entry) => entry.id === key)?.title as string;
  },

  /**
   * Render the current channel settings page
   */
  // we take care of the reactivity ourselves
  /* eslint-disable solid/components-return-once */
  render(props, channel) {
    const id = props.page();
    const client = useClient();

    if (id?.startsWith("webhooks/")) {
      const webhook = client().channelWebhooks.get(id.substring(9));
      return <Webhook webhook={webhook!} />;
    }

    switch (id) {
      case "overview":
        return <ChannelOverview channel={channel} />;
      case "permissions":
        switch (channel.type) {
          case "Group":
            return <ChannelPermissionsEditor type="group" context={channel} />;
          default:
            return null;
        }

      case "webhooks":
        return <Webhooks channel={channel} />;
      default:
        return null;
    }
  },
  /* eslint-enable solid/components-return-once */

  /**
   * Generate list of categories / entries for channel settings
   * @returns List
   */
  list(channel) {
    const { openModal } = useModals();

    return {
      entries: [
        {
          title: <TextWithEmoji content={channel.name} />,
          entries: [
            {
              id: "overview",
              icon: <BiSolidInfoCircle size={20} />,
              title: <Trans>Overview</Trans>,
            },
            {
              hidden:
                channel.type === "SavedMessages" ||
                !channel.havePermission("ManagePermissions"),
              id: "permissions",
              icon: <BiRegularListUl size={20} />,
              title: <Trans>Permissions</Trans>,
            },
            {
              hidden:
                !channel.havePermission("ManageWebhooks") &&
                import.meta.env.PROD,
              id: "webhooks",
              icon: <BiSolidCloud size={20} />,
              title: <Trans>Webhooks</Trans>,
            },
          ],
        },
        {
          hidden: !(
            channel.type !== "Group" && channel.havePermission("ManageChannel")
          ),
          entries: [
            {
              icon: (
                <BiSolidTrash
                  size={20}
                  color="var(--customColours-error-color)"
                />
              ),
              title: (
                <ColouredText colour="var(--customColours-error-color)">
                  <Trans>Delete Channel</Trans>
                </ColouredText>
              ),
              onClick() {
                openModal({
                  type: "delete_channel",
                  channel,
                });
              },
            },
          ],
        },
      ],
    };
  },
};

export default Config;

export type ChannelSettingsProps = {
  /**
   * Channel
   */
  channel: Channel;
};
