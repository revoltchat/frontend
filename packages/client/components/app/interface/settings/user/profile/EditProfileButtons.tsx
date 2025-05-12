import { Match, Switch } from "solid-js";

import { Trans } from "@lingui-solid/solid/macro";
import { User } from "revolt.js";

import { useClient } from "@revolt/client";
import { createOwnProfileResource } from "@revolt/client/resources";
import { useModals } from "@revolt/modal";
import {
  CategoryButton,
  CategoryButtonGroup,
  CategoryCollapse,
  iconSize,
} from "@revolt/ui";

import MdBadge from "@material-design-icons/svg/outlined/badge.svg?component-solid";
import MdCrop169 from "@material-design-icons/svg/outlined/crop_16_9.svg?component-solid";
import MdDelete from "@material-design-icons/svg/outlined/delete.svg?component-solid";
import MdReplaceImage from "@material-design-icons/svg/outlined/edit.svg?component-solid";
import MdEditNote from "@material-design-icons/svg/outlined/edit_note.svg?component-solid";
import MdImage from "@material-design-icons/svg/outlined/image.svg?component-solid";

export function EditProfileButtons(props: { user: User }) {
  const client = useClient();
  const { openModal } = useModals();
  const profile = createOwnProfileResource();

  function selectImage(tag: string, cb: (id: string) => void) {
    const el = document.createElement("input");
    el.type = "file";
    el.accept = "image/*";

    el.onchange = async () => {
      if (el.files) {
        const [file] = el.files;
        if (file) {
          const body = new FormData();
          body.append("file", file);

          const data = await fetch(
            `${client().configuration?.features.autumn.url}/${tag}`,
            {
              method: "POST",
              body,
            },
          ).then((res) => res.json());

          // TODO: show progress (at least pending, use mutations from tanstack query?)
          // TODO: handle errors

          cb(data.id);
        }
      }
    };

    document.body.append(el);
    el.click();
    el.remove();
  }

  function replaceAvatar() {
    selectImage("avatars", (avatar) => props.user.edit({ avatar }));
  }

  function replaceBanner() {
    selectImage("backgrounds", (background) =>
      props.user
        .edit({ profile: { background } })
        .then(() => profile.refetch()),
    );
  }

  return (
    <CategoryButtonGroup>
      <CategoryButton
        description={<Trans>Set a global name</Trans>}
        icon={<MdBadge {...iconSize(22)} />}
        action="chevron"
        onClick={() =>
          openModal({
            type: "edit_display_name",
            user: props.user,
          })
        }
      >
        <Trans>Display Name</Trans>
      </CategoryButton>
      <Switch
        fallback={
          <CategoryButton
            description={<Trans>Set a profile picture</Trans>}
            icon={<MdImage {...iconSize(22)} />}
            action="chevron"
            onClick={replaceAvatar}
          >
            <Trans>Avatar</Trans>
          </CategoryButton>
        }
      >
        <Match when={props.user.avatar}>
          <CategoryCollapse
            icon={<MdImage {...iconSize(22)} />}
            title={<Trans>Avatar</Trans>}
            description={<Trans>Change or remove your profile picture</Trans>}
          >
            <CategoryButton
              description={<Trans>Set a new picture</Trans>}
              icon={<MdReplaceImage {...iconSize(22)} />}
              action="chevron"
              onClick={replaceAvatar}
            >
              <Trans>Replace Avatar</Trans>
            </CategoryButton>
            <CategoryButton
              description={<Trans>Remove your current avatar</Trans>}
              icon={<MdDelete {...iconSize(22)} />}
              action="chevron"
              onClick={() => props.user.edit({ remove: ["Avatar"] })}
            >
              <Trans>Remove Avatar</Trans>
            </CategoryButton>
          </CategoryCollapse>
        </Match>
      </Switch>
      <Switch
        fallback={
          <CategoryButton
            description={<Trans>Set a profile banner</Trans>}
            icon={<MdCrop169 {...iconSize(22)} />}
            action="chevron"
            onClick={replaceBanner}
          >
            <Trans>Banner</Trans>
          </CategoryButton>
        }
      >
        <Match when={profile.data?.banner}>
          <CategoryCollapse
            icon={<MdCrop169 {...iconSize(22)} />}
            title={<Trans>Banner</Trans>}
            description={<Trans>Change or remove your profile banner</Trans>}
          >
            <CategoryButton
              description={<Trans>Set a new banner</Trans>}
              icon={<MdReplaceImage {...iconSize(22)} />}
              action="chevron"
              onClick={replaceBanner}
            >
              <Trans>Replace Banner</Trans>
            </CategoryButton>
            <CategoryButton
              description={<Trans>Remove your current banner</Trans>}
              icon={<MdDelete {...iconSize(22)} />}
              action="chevron"
              onClick={() => props.user.edit({ remove: ["ProfileBackground"] })}
            >
              <Trans>Remove Banner</Trans>
            </CategoryButton>
          </CategoryCollapse>
        </Match>
      </Switch>
      <CategoryButton
        description={<Trans>Set a profile description</Trans>}
        icon={<MdEditNote {...iconSize(22)} />}
        action="chevron"
      >
        <Trans>Bio</Trans>
      </CategoryButton>
    </CategoryButtonGroup>
  );
}
