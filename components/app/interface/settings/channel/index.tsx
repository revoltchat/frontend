import {
  BiRegularListUl,
  BiSolidEnvelope,
  BiSolidFlagAlt,
  BiSolidGroup,
  BiSolidHappyBeaming,
  BiSolidInfoCircle,
  BiSolidTrash,
  BiSolidUserX,
} from "solid-icons/bi";

import { Channel, Server } from "revolt.js";

import { useUser } from "@revolt/client";
import { useTranslation } from "@revolt/i18n";
import { TextWithEmoji } from "@revolt/markdown";
import { ColouredText, useTheme } from "@revolt/ui";

import { SettingsConfiguration } from "..";

const Config: SettingsConfiguration<Channel> = {
  /**
   * Page titles
   * @param key
   */
  title(key) {
    const t = useTranslation();
    return t(`app.settings.channel_pages.${key.replaceAll("/", ".")}.title`);
  },

  /**
   * Render the current channel settings page
   */
  render(props, channel) {
    // eslint-disable-next-line solid/reactivity
    const id = props.page();

    switch (id) {
      default:
        return null;
    }
  },

  /**
   * Generate list of categories / entries for channel settings
   * @returns List
   */
  list(channel) {
    const t = useTranslation();
    const theme = useTheme();

    return [
      {
        title: <TextWithEmoji content={channel.name} />,
        entries: [
          {
            id: "overview",
            icon: <BiSolidInfoCircle size={20} />,
            title: t("app.settings.channel_pages.overview.title"),
          },
          {
            hidden: !channel.havePermission("ManagePermissions"),
            id: "permissions",
            icon: <BiRegularListUl size={20} />,
            title: t("app.settings.channel_pages.permissions.title"),
          },
        ],
      },
      {
        hidden: !(
          channel.type !== "Group" && channel.havePermission("ManageChannel")
        ),
        entries: [
          {
            icon: <BiSolidTrash size={20} color={theme!.colours.error} />,
            title: (
              <ColouredText colour={theme!.colours.error}>
                {t("app.context_menu.delete_channel")}
              </ColouredText>
            ),
          },
        ],
      },
    ];
  },
};

export default Config;

export type ChannelSettingsProps = {
  /**
   * Channel
   */
  channel: Channel;
};
