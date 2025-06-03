import { For } from "solid-js";

import { Trans } from "@lingui-solid/solid/macro";

import {
  Avatar,
  ListItem,
  Modal2,
  Modal2Props,
  OverflowingText,
} from "@revolt/ui";

import { useModals } from "..";
import { Modals } from "../types";

export function UserProfileMutualFriendsModal(
  props: Modal2Props & Modals & { type: "user_profile_mutual_friends" },
) {
  const { openModal } = useModals();

  return (
    <Modal2
      minWidth={420}
      show={props.show}
      onClose={props.onClose}
      title={<Trans>Mutual Friends</Trans>}
      actions={[{ text: <Trans>Close</Trans> }]}
    >
      <For each={props.users}>
        {(user) => (
          <ListItem onClick={() => openModal({ type: "user_profile", user })}>
            <Avatar
              slot="icon"
              size={36}
              src={user.animatedAvatarURL}
              fallback={user.displayName}
            />
            <OverflowingText>{user.username}</OverflowingText>
          </ListItem>
        )}
      </For>
    </Modal2>
  );
}
