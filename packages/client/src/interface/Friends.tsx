import { BiSolidUserDetail } from "solid-icons/bi";
import {
  Accessor,
  For,
  JSX,
  Match,
  Show,
  Switch,
  createMemo,
  createSignal,
  splitProps,
} from "solid-js";

import { VirtualContainer } from "@minht11/solid-virtual-container";
import type { User } from "revolt.js";
import { styled } from "styled-system/jsx";

import { UserContextMenu } from "@revolt/app";
import { useClient } from "@revolt/client";
import { modalController } from "@revolt/modal";
import {
  Avatar,
  Badge,
  Button,
  CategoryButton,
  Deferred,
  Header,
  List,
  ListItem,
  ListSubheader,
  NavigationRail,
  NavigationRailItem,
  OverflowingText,
  Tabs,
  Typography,
  UserStatusGraphic,
} from "@revolt/ui";

import MdAdd from "@material-design-icons/svg/outlined/add.svg?component-solid";
import MdBlock from "@material-design-icons/svg/outlined/block.svg?component-solid";
import MdGroup from "@material-design-icons/svg/outlined/group.svg?component-solid";
import MdNotifications from "@material-design-icons/svg/outlined/notifications.svg?component-solid";
import MdWavingHand from "@material-design-icons/svg/outlined/waving_hand.svg?component-solid";

import { HeaderIcon } from "./common/CommonHeader";

/**
 * Base layout of the friends page
 */
const Base = styled("div", {
  base: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    "& .FriendsList": {
      paddingInline: "var(--gap-lg)",
    },
  },
});

// const ListBase = styled("div", {
//   base: {
//     "&:not(:first-child)": {
//       paddingTop: "var(--gap-lg)",
//     },
//   },
// });

/**
 * Typed accessor for lists
 */
type FriendLists = Accessor<{
  [key in "online" | "offline" | "incoming" | "outgoing" | "blocked"]: User[];
}>;

/**
 * Friends menu
 */
export function Friends() {
  const client = useClient();

  /**
   * Reference to the parent scroll container
   */
  let scrollTargetElement!: HTMLDivElement;

  /**
   * Signal required for reacting to ref changes
   */
  const targetSignal = () => scrollTargetElement;

  /**
   * Generate lists of all users
   */
  const lists = createMemo(() => {
    const list = client()!.users.toList();

    const friends = list
      .filter((user) => user.relationship === "Friend")
      .sort((a, b) => a.username.localeCompare(b.username));

    return {
      friends,
      online: friends.filter((user) => user.online),
      incoming: list
        .filter((user) => user.relationship === "Incoming")
        .sort((a, b) => a.username.localeCompare(b.username)),
      outgoing: list
        .filter((user) => user.relationship === "Outgoing")
        .sort((a, b) => a.username.localeCompare(b.username)),
      blocked: list
        .filter((user) => user.relationship === "Blocked")
        .sort((a, b) => a.username.localeCompare(b.username)),
    };
  });

  const pending = () => {
    const incoming = lists().incoming;
    return incoming.length > 99 ? "99+" : incoming.length;
  };

  const [page, setPage] = createSignal("online");

  return (
    // TODO: i18n
    <Base>
      <Header placement="primary">
        <HeaderIcon>
          <BiSolidUserDetail size={24} />
        </HeaderIcon>
        Friends
      </Header>

      <div
        style={{
          position: "relative",
          "min-height": 0,
        }}
      >
        <NavigationRail contained value={page} onValue={setPage}>
          <div style={{ "margin-top": "6px", "margin-bottom": "12px" }}>
            <Button
              size="fab"
              onPress={() =>
                modalController.push({ type: "add_friend", client: client() })
              }
            >
              <MdAdd />
            </Button>
          </div>

          <NavigationRailItem icon={<MdWavingHand />} value="online">
            Online
          </NavigationRailItem>
          <NavigationRailItem icon={<MdGroup />} value="all">
            All
          </NavigationRailItem>
          <NavigationRailItem icon={<MdNotifications />} value="pending">
            Pending
            <Show when={pending()}>
              <Badge slot="badge" variant="large">
                {pending()}
              </Badge>
            </Show>
          </NavigationRailItem>
          <NavigationRailItem icon={<MdBlock />} value="blocked">
            Blocked
          </NavigationRailItem>
        </NavigationRail>

        <Deferred>
          <div class="FriendsList" ref={scrollTargetElement} use:scrollable>
            <Switch
              fallback={
                <People
                  title="Online"
                  users={lists().online}
                  scrollTargetElement={targetSignal}
                />
              }
            >
              <Match when={page() === "all"}>
                <People
                  title="All"
                  users={lists().friends}
                  scrollTargetElement={targetSignal}
                />
              </Match>
              <Match when={page() === "pending"}>
                <People
                  title="Incoming"
                  users={lists().incoming}
                  scrollTargetElement={targetSignal}
                />
                <People
                  title="Outgoing"
                  users={lists().outgoing}
                  scrollTargetElement={targetSignal}
                />
              </Match>
              <Match when={page() === "blocked"}>
                <People
                  title="Blocked"
                  users={lists().blocked}
                  scrollTargetElement={targetSignal}
                />
              </Match>
            </Switch>
          </div>
        </Deferred>
      </div>
    </Base>
  );
}

/**
 * List of users
 */
function People(props: {
  users: User[];
  title: string;
  scrollTargetElement: Accessor<HTMLDivElement>;
}) {
  return (
    <List>
      <ListSubheader>
        {props.title} {"–"} {props.users.length}
      </ListSubheader>

      <Show when={props.users.length === 0}>
        <ListItem disabled>Nobody here right now!</ListItem>
      </Show>

      <VirtualContainer
        items={props.users}
        scrollTarget={props.scrollTargetElement()}
        itemSize={{ height: 58 }}
        // grid rendering:
        // itemSize={{ height: 60, width: 240 }}
        // crossAxisCount={(measurements) =>
        //   Math.floor(measurements.container.cross / measurements.itemSize.cross)
        // }
        // width: 100% needs to be removed from listentry below for this to work ^^^
      >
        {(item) => (
          <ContainerListEntry
            style={{
              ...item.style,
            }}
          >
            <Entry
              role="listitem"
              tabIndex={item.tabIndex}
              style={item.style}
              user={item.item}
            />
          </ContainerListEntry>
        )}
      </VirtualContainer>
    </List>
  );
}

const ContainerListEntry = styled("div", {
  base: {
    width: "100%",
  },
});

/**
 * Single user entry
 */
function Entry(
  props: { user: User } & Omit<
    JSX.AnchorHTMLAttributes<HTMLAnchorElement>,
    "href"
  >
) {
  const [local, remote] = splitProps(props, ["user"]);

  return (
    <a
      {...remote}
      use:floating={{
        contextMenu: () => <UserContextMenu user={local.user} />,
      }}
    >
      <ListItem>
        <Avatar
          slot="icon"
          size={36}
          src={local.user.animatedAvatarURL}
          holepunch={
            props.user.relationship === "Friend" ? "bottom-right" : "none"
          }
          overlay={
            <Show when={props.user.relationship === "Friend"}>
              <UserStatusGraphic
                status={props.user.status?.presence ?? "Online"}
              />
            </Show>
          }
        />
        <OverflowingText>{local.user.username}</OverflowingText>
      </ListItem>
    </a>
  );
}

/**
 * Overlapping avatars
 */
const Avatars = styled("div", {
  base: {
    flexShrink: 0,
    "& svg:not(:first-child)": {
      position: "relative",
      marginInlineStart: "-32px",
    },
  },
});
