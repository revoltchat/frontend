import { BiSolidChevronDown, BiSolidUserDetail } from "solid-icons/bi";
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

import { useClient } from "@revolt/client";
import { useTranslation } from "@revolt/i18n";
import { modalController } from "@revolt/modal";
import {
  Avatar,
  Badge,
  Button,
  CategoryButton,
  Deferred,
  Header,
  NavigationRail,
  NavigationRailItem,
  OverflowingText,
  Tabs,
  Typography,
  UserStatusGraphic,
  styled as styledLegacy,
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
const Base = styledLegacy("div")`
  width: 100%;
  display: flex;
  flex-direction: column;

  .FriendsList {
    padding-inline-start: ${(props) => props.theme!.gap.sm};
    padding-inline-end: ${(props) => props.theme!.gap.md};
    overflow-y: scroll;
    height: 100%;
  }
`;

const ListBase = styled("div", {
  base: {
    "&:not(:first-child)": {
      paddingTop: "var(--gap-lg)",
    },
  },
});

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
        {/* <Button
          size="inline"
          onPress={() =>
            modalController.push({ type: "add_friend", client: client() })
          }
        >
          Add Friend
        </Button> */}
      </Header>

      <div
        style={{
          position: "relative",
          "min-height": 0,
        }}
      >
        <NavigationRail contained value={page} onValue={setPage}>
          <div style={{ "margin-top": "6px", "margin-bottom": "12px" }}>
            <Button size="fab">
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
                <List
                  title="Online"
                  users={lists().online}
                  scrollTargetElement={targetSignal}
                />
              }
            >
              <Match when={page() === "all"}>
                <List
                  title="All"
                  users={lists().friends}
                  scrollTargetElement={targetSignal}
                />
              </Match>
              <Match when={page() === "pending"}>
                <List
                  title="Incoming"
                  users={lists().incoming}
                  scrollTargetElement={targetSignal}
                />
                <List
                  title="Outgoing"
                  users={lists().outgoing}
                  scrollTargetElement={targetSignal}
                />
              </Match>
              <Match when={page() === "blocked"}>
                <List
                  title="Blocked"
                  users={lists().blocked}
                  scrollTargetElement={targetSignal}
                />
              </Match>
            </Switch>
          </div>
        </Deferred>

        <div />
        {/* <div class="FriendsList" ref={scrollTargetElement} use:scrollable>
            <Tabs
              tabs={[
                {
                  title: "Online",
                  content: (
                    <List
                      title="Online"
                      users={lists().online}
                      scrollTargetElement={targetSignal}
                    />
                  ),
                },
                {
                  title: "All",
                  content: (
                    <List
                      title="All"
                      users={lists().friends}
                      scrollTargetElement={targetSignal}
                    />
                  ),
                },
                {
                  title: (
                    <>
                      Pending{" "}
                      <Show when={pending()}>
                        <Badge slot="badge" variant="large">
                          {pending()}
                        </Badge>
                      </Show>
                    </>
                  ),
                  content: (
                    <>
                      <List
                        title="Incoming"
                        users={lists().incoming}
                        scrollTargetElement={targetSignal}
                      />
                      <List
                        title="Outgoing"
                        users={lists().outgoing}
                        scrollTargetElement={targetSignal}
                      />
                    </>
                  ),
                },
                {
                  title: "Blocked",
                  content: (
                    <List
                      title="Blocked"
                      users={lists().blocked}
                      scrollTargetElement={targetSignal}
                    />
                  ),
                },
              ]}
            />
          </div> */}
      </div>
    </Base>
  );
}

/**
 * List of users
 */
function List(props: {
  users: User[];
  title: string;
  scrollTargetElement: Accessor<HTMLDivElement>;
}) {
  return (
    <ListBase>
      <Typography variant="category">
        {props.title} {"–"} {props.users.length}
      </Typography>
      <VirtualContainer
        items={props.users}
        scrollTarget={props.scrollTargetElement()}
        itemSize={{ height: 60 }}
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
            <div style={{ margin: "6px" }}>
              <Entry
                role="listitem"
                tabIndex={item.tabIndex}
                style={item.style}
                user={item.item}
              />
            </div>
          </ContainerListEntry>
        )}
      </VirtualContainer>
    </ListBase>
  );
}

const ContainerListEntry = styled("div", {
  base: {
    width: "100%",
  },
});

/**
 * Some temporary styles for friend entries
 */
const Friend = styled("div", {
  base: {
    minWidth: 0,
    display: "flex",
    gap: "var(--gap-md)",
    alignItems: "center",
    // padding: "var(--gap-md)",
    // borderRadius: "var(--borderRadius-lg)",
    // background: "var(--colours-sidebar-channels-background)",
  },
});

/**
 * Single user entry
 */
function Entry(
  props: { user: User } & Omit<
    JSX.AnchorHTMLAttributes<HTMLAnchorElement>,
    "href"
  >,
) {
  const [local, remote] = splitProps(props, ["user"]);

  return (
    <a {...remote}>
      <Friend>
        <Avatar
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
      </Friend>
    </a>
  );
}

/**
 * Overlapping avatars
 */
const Avatars = styledLegacy("div", "Avatars")`
  flex-shrink: 0;

  svg:not(:first-child) {
    position: relative;
    margin-inline-start: -32px;
  }
`;

/**
 * Pending requests button
 */
function PendingRequests(props: { lists: FriendLists }) {
  const t = useTranslation();

  /**
   * Shorthand for generating incoming list
   * @returns List of users
   */
  const incoming = () => props.lists().incoming;

  /**
   * Generate pending requests description
   * @returns Localised string
   */
  const description = () => {
    const list = incoming();
    const length = list.length;

    if (length === 1) {
      return t("app.special.friends.from.single", { user: list[0].username });
    } else if (length <= 3) {
      return t("app.special.friends.from.multiple", {
        userlist: list
          .slice(0, 2)
          .map((user) => user.username)
          .join(", "),
        user: list.slice(-1)[0].username,
      });
    } else {
      return t("app.special.friends.from.several", {
        userlist: list
          .slice(0, 3)
          .map((user) => user.username)
          .join(", "),
        count: (length - 3).toString(),
      });
    }
  };

  return (
    <Show when={incoming().length}>
      <CategoryButton
        action="chevron"
        icon={
          <Avatars>
            <For each={incoming().slice(0, 3)}>
              {(user, index) => (
                <Avatar
                  src={user.animatedAvatarURL}
                  size={64}
                  holepunch={index() == 2 ? "none" : "overlap"}
                />
              )}
            </For>
          </Avatars>
        }
        description={description()}
      >
        {incoming().length} Pending Requests
      </CategoryButton>
    </Show>
  );
}
