import { For } from "solid-js";

import { useClient } from "@revolt/client";
import { createOwnProfileResource } from "@revolt/client/resources";
import { modalController } from "@revolt/modal";
import {
  Avatar,
  CategoryButton,
  CategoryButtonGroup,
  CategoryCollapse,
  Column,
  iconSize,
} from "@revolt/ui";

import MdBadge from "@material-design-icons/svg/outlined/badge.svg?component-solid";
import MdCrop169 from "@material-design-icons/svg/outlined/crop_16_9.svg?component-solid";
import MdEditNote from "@material-design-icons/svg/outlined/edit_note.svg?component-solid";
import MdGroups from "@material-design-icons/svg/outlined/groups.svg?component-solid";
import MdImage from "@material-design-icons/svg/outlined/image.svg?component-solid";

import { UserSummary } from "../account";

/**
 * Edit profile
 */
export function EditProfile() {
  const client = useClient();
  const profile = createOwnProfileResource();

  return (
    <Column gap="lg">
      <UserSummary
        user={client().user!}
        bannerUrl={profile.data?.animatedBannerURL}
      />

      <CategoryButtonGroup>
        <CategoryButton
          description="Change your name without having to change your username"
          icon={<MdBadge {...iconSize(22)} />}
          action="chevron"
          onClick={() =>
            modalController.push({
              type: "edit_display_name",
              user: client().user!,
            })
          }
        >
          Display Name
        </CategoryButton>
        <CategoryButton
          description="Set a picture to show next to your messages and various other places"
          icon={<MdImage {...iconSize(22)} />}
          action="chevron"
        >
          Avatar
        </CategoryButton>
        <CategoryButton
          description="Set a banner to show in your profile"
          icon={<MdCrop169 {...iconSize(22)} />}
          action="chevron"
        >
          Banner
        </CategoryButton>
        <CategoryButton
          description="Set a description to show in your profile"
          icon={<MdEditNote {...iconSize(22)} />}
          action="chevron"
        >
          Bio
        </CategoryButton>
      </CategoryButtonGroup>

      <CategoryButtonGroup>
        <CategoryCollapse
          icon={<MdGroups {...iconSize(22)} />}
          title="Server Identities"
          description="Change your profile per-server"
          scrollable
        >
          <For each={client().servers.toList()}>
            {(server) => (
              <CategoryButton
                icon={
                  <Avatar
                    src={server.animatedIconURL}
                    size={24}
                    fallback={server.name}
                  />
                }
                onClick={() =>
                  modalController.push({
                    type: "server_identity",
                    member: server.member!,
                  })
                }
              >
                {server.name}
              </CategoryButton>
            )}
          </For>
        </CategoryCollapse>
      </CategoryButtonGroup>
    </Column>
  );
}
