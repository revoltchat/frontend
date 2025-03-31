import {
  BiRegularListUl,
  BiSolidCloud,
  BiSolidInfoCircle,
  BiSolidTrash,
} from "solid-icons/bi";

import { Trans } from "@lingui-solid/solid/macro";
import { Channel } from "revolt.js";

import { useClient } from "@revolt/client";
import { getController } from "@revolt/common";
import { TextWithEmoji } from "@revolt/markdown";
import { ColouredText } from "@revolt/ui";

import { SettingsConfiguration } from "..";

import ChannelOverview from "./Overview";
import Webhooks, { Webhook } from "./Webhooks";

const Config: SettingsConfiguration<Channel> = {
  /**
   * Page titles
   * @param key
   */
  title(key) {
    const client = useClient();

    if (key.startsWith("webhooks/")) {
      const webhook = client().channelWebhooks.get(key.substring(9));
      return webhook!.name;
    }

    // return t(
    //   `app.settings.channel_pages.${key.replaceAll("/", ".")}.title` as any
    // );
    return "todo";
  },

  /**
   * Render the current channel settings page
   */
  render(props, channel) {
    const id = props.page();
    const client = useClient();

    if (id?.startsWith("webhooks/")) {
      const webhook = client().channelWebhooks.get(id.substring(9));
      return <Webhook webhook={webhook!} />;
    }

    switch (id) {
      case "webhooks":
        return <Webhooks channel={channel} />;
      default:
        return <ChannelOverview channel={channel} />;
    }
  },

  /**
   * Generate list of categories / entries for channel settings
   * @returns List
   */
  list(channel) {
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
              hidden: !channel.havePermission("ManagePermissions"),
              id: "permissions",
              icon: <BiRegularListUl size={20} />,
              title: <Trans>Permissions</Trans>,
            },
            {
              hidden: !channel.havePermission("ManageWebhooks"),
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
              /**
               * Handle server deletion request
               */
              onClick() {
                getController("modal").push({
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
