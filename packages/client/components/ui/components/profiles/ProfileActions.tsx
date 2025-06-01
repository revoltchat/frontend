import { Show } from "solid-js";

import { ServerMember, User } from "revolt.js";
import { styled } from "styled-system/jsx";

import { UserContextMenu } from "@revolt/app";

import MdMoreVert from "@material-design-icons/svg/filled/more_vert.svg?component-solid";
import MdCancel from "@material-design-icons/svg/filled/cancel.svg?component-solid";

import { Button } from "../design";
import { useNavigate } from "@solidjs/router";

/**
 * Actions shown on profile cards
 */
export function ProfileActions(props: {
  user: User;
  member?: ServerMember;
  width: 2 | 3;
}) {
  const navigate = useNavigate();

  /**
   * Open direct message channel
   */
  function openDm() {
    props.user.openDM().then((channel) => navigate(channel.url));
  }

  return (
    <Actions width={props.width}>
      <Show when={props.user.relationship === "None" && !props.user.bot}>
        <Button onPress={() => props.user.addFriend()}>Add Friend</Button>
      </Show>
      <Show when={props.user.relationship === "Incoming"}>
        <Button onPress={() => props.user.addFriend()}>Accept friend request</Button>
        <Button size="icon" onPress={() => props.user.removeFriend()}><MdCancel /></Button>
      </Show>
      <Show when={props.user.relationship === "Outgoing"}>
        <Button onPress={() => props.user.addFriend()}>Cancel friend request</Button>
      </Show>
      <Show when={props.user.relationship === "Friend"}>
        <Button onPress={() => props.user.openDM()}>Message</Button>
      </Show>

      <Button
        size="icon"
        use:floating={{
          contextMenu: () => (
            <UserContextMenu user={props.user} member={props.member} />
          ),
          contextMenuHandler: "click",
        }}
      >
        <MdMoreVert />
      </Button>
    </Actions>
  );
}

const Actions = styled("div", {
  base: {
    display: "flex",
    gap: "var(--gap-md)",
    justifyContent: "flex-end",
  },
  variants: {
    width: {
      3: {
        gridColumn: "1 / 4",
      },
      2: {
        gridColumn: "1 / 3",
      },
    },
  },
});
