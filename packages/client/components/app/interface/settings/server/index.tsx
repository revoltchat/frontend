import {
  BiSolidEnvelope,
  BiSolidFlagAlt,
  BiSolidGroup,
  BiSolidHappyBeaming,
  BiSolidInfoCircle,
  BiSolidTrash,
  BiSolidUserX,
} from "solid-icons/bi";

import { Trans } from "@lingui-solid/solid/macro";
import { Server } from "revolt.js";

import { useUser } from "@revolt/client";
import { getController } from "@revolt/common";
import { TextWithEmoji } from "@revolt/markdown";
import { ColouredText } from "@revolt/ui";

import { SettingsConfiguration } from "..";

import Overview from "./Overview";

const Config: SettingsConfiguration<Server> = {
  /**
   * Page titles
   * @param key
   */
  title(key) {
    return "todo";
    // return t(
    //   `app.settings.server_pages.${key.replaceAll("/", ".")}.title` as any,
    //   undefined,
    //   key
    // );
  },

  /**
   * Render the current server settings page
   */
  render(props, server) {
    const id = props.page();

    if (!server.$exists) {
      getController("modal").pop();
      return null;
    }

    switch (id) {
      case "overview":
        return <Overview server={server} />;
      default:
        return null;
    }
  },

  /**
   * Generate list of categories / entries for server settings
   * @returns List
   */
  list(server) {
    const user = useUser();

    return {
      entries: [
        {
          title: <TextWithEmoji content={server.name} />,
          entries: [
            {
              id: "overview",
              icon: <BiSolidInfoCircle size={20} />,
              title: <Trans>Overview</Trans>,
            },
            {
              id: "members",
              icon: <BiSolidGroup size={20} />,
              title: <Trans>Members</Trans>,
            },
            {
              hidden: !(
                server.havePermission("ManageRole") ||
                server.havePermission("AssignRoles")
              ),
              id: "roles",
              icon: <BiSolidFlagAlt size={20} />,
              title: <Trans>Roles</Trans>,
            },
          ],
        },
        {
          hidden: !server.havePermission("ManageCustomisation"),
          title: <Trans>Customisation</Trans>,
          entries: [
            {
              id: "emojis",
              icon: <BiSolidHappyBeaming size={20} />,
              title: <Trans>Emojis</Trans>,
            },
          ],
        },
        {
          hidden:
            !server.havePermission("ManageServer") &&
            !server.havePermission("BanMembers"),
          title: <Trans>User Management</Trans>,
          entries: [
            {
              hidden: !server.havePermission("ManageServer"),
              id: "invites",
              icon: <BiSolidEnvelope size={20} />,
              title: <Trans>Invites</Trans>,
            },
            {
              hidden: !server.havePermission("BanMembers"),
              id: "bans",
              icon: <BiSolidUserX size={20} />,
              title: <Trans>Bans</Trans>,
            },
          ],
        },
        {
          hidden: !(server.ownerId === user()?.id),
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
                  <Trans>Delete Server</Trans>
                </ColouredText>
              ),
              /**
               * Handle server deletion request
               */
              onClick() {
                getController("modal").push({
                  type: "delete_server",
                  server,
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

export type ServerSettingsProps = {
  /**
   * Server
   */
  server: Server;
};
