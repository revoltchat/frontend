import { BiSolidChevronDown, BiSolidUserDetail } from "solid-icons/bi";
import {
  Accessor,
  For,
  JSX,
  Show,
  createMemo,
  createSignal,
  splitProps,
} from "solid-js";

import { VirtualContainer } from "@minht11/solid-virtual-container";
import type { User } from "revolt.js";

import { useClient } from "@revolt/client";
import { useTranslation } from "@revolt/i18n";
import {
  Avatar,
  CategoryButton,
  Deferred,
  Header,
  Typography,
  UserStatusGraphic,
  scrollable,
  styled,
} from "@revolt/ui";

import { HeaderIcon } from "./common/CommonHeader";

scrollable;

/**
 * Base layout of the friends page
 */
const Base = styled("div")`
  width: 100%;
  display: flex;
  flex-direction: column;
  background: ${(props) => props.theme!.colours["background-200"]};

  .FriendsList {
    padding: ${(props) => props.theme!.gap.lg};
  }
`;

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
      online: friends.filter((user) => user.online),
      offline: friends.filter((user) => !user.online),
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

  return (
    // TODO: i18n
    <Base>
      <Header placement="primary">
        <HeaderIcon>
          <BiSolidUserDetail size={24} />
        </HeaderIcon>
        Friends
      </Header>
      <div class="FriendsList" ref={scrollTargetElement} use:scrollable>
        <PendingRequests lists={lists} />
        <List
          title="Outgoing"
          users={lists().outgoing}
          scrollTargetElement={targetSignal}
        />
        <List
          title="Online"
          users={lists().online}
          scrollTargetElement={targetSignal}
        />
        <List
          title="Offline"
          users={lists().offline}
          scrollTargetElement={targetSignal}
        />
        <List
          title="Blocked"
          users={lists().blocked}
          scrollTargetElement={targetSignal}
        />
      </div>
    </Base>
  );
}

const Title = styled.a<{ active: boolean }>`
  display: flex;
  align-items: center;
  flex-direction: row;

  user-select: none;
  gap: ${(props) => props.theme!.gap.sm};
  margin-top: ${(props) => props.theme!.gap.lg};
  transition: ${(props) => props.theme!.transitions.fast} all;

  color: ${(props) =>
    props.theme!.colours[props.active ? "foreground-200" : "foreground-400"]};

  svg {
    transition: ${(props) => props.theme!.transitions.fast} all;
    transform: rotate(${(props) => (props.active ? "0" : "-90deg")});
  }
`;

/**
 * List of users
 */
function List(props: {
  users: User[];
  title?: string;
  scrollTargetElement: Accessor<HTMLDivElement>;
}) {
  const [active, setActive] = createSignal(true);

  return (
    <Deferred>
      <Show when={props.title}>
        <Title active={active()} onClick={() => setActive((active) => !active)}>
          <BiSolidChevronDown size={16} />
          <Typography variant="category">
            {props.title} {"–"} {props.users.length}
          </Typography>
        </Title>
      </Show>
      <Show when={active()}>
        <VirtualContainer
          items={props.users}
          scrollTarget={props.scrollTargetElement()}
          itemSize={{ height: 60 }}
        >
          {(item) => (
            <div
              style={{ ...item.style, width: "100%", "padding-block": "6px" }}
            >
              <Entry
                role="listitem"
                tabIndex={item.tabIndex}
                style={item.style}
                user={item.item}
              />
            </div>
          )}
        </VirtualContainer>
      </Show>
    </Deferred>
  );
}

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
    <a {...remote}>
      <CategoryButton
        icon={
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
        }
      >
        {local.user.username}
      </CategoryButton>
    </a>
  );
}

/**
 * Overlapping avatars
 */
const Avatars = styled("div", "Avatars")`
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
