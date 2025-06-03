import { For } from "solid-js";

import { Trans } from "@lingui-solid/solid/macro";
import { useNavigate } from "@solidjs/router";

import {
  Avatar,
  ListItem,
  Modal2,
  Modal2Props,
  OverflowingText,
} from "@revolt/ui";

import { useModals } from "..";
import { Modals } from "../types";

export function UserProfileMutualGroupsModal(
  props: Modal2Props & Modals & { type: "user_profile_mutual_groups" },
) {
  const navigate = useNavigate();
  const { closeAll } = useModals();

  return (
    <Modal2
      minWidth={420}
      show={props.show}
      onClose={props.onClose}
      title={<Trans>Mutual Groups</Trans>}
      actions={[{ text: <Trans>Close</Trans> }]}
    >
      <For each={props.groups}>
        {(group) => (
          <ListItem
            onClick={() => {
              navigate(group.path);
              closeAll();
            }}
          >
            <Avatar
              slot="icon"
              size={36}
              src={group.animatedIconURL}
              fallback={group.name}
            />
            <OverflowingText>{group.name}</OverflowingText>
          </ListItem>
        )}
      </For>
    </Modal2>
  );
}
