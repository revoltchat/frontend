import { For, Match, Show, Switch, createMemo, onMount } from "solid-js";

import { VirtualContainer } from "@minht11/solid-virtual-container";
import { API, Channel, ServerMember } from "revolt.js";

import { useClient } from "@revolt/client";
import { useTranslation } from "@revolt/i18n";
import { TextWithEmoji } from "@revolt/markdown";
import { userInformation } from "@revolt/markdown/users";
import {
  Avatar,
  Column,
  Deferred,
  MenuButton,
  OverflowingText,
  Row,
  Tooltip,
  Typography,
  UserStatus,
  UserStatusGraphic,
  Username,
  floating,
  scrollable,
  styled,
} from "@revolt/ui";
import { generateTypographyCSS } from "@revolt/ui/components/design/atoms/display/Typography";

floating;
scrollable;

interface Props {
  /**
   * Channel
   */
  channel: Channel;
}

/**
 * Member Sidebar
 */
export function MemberSidebar(props: Props) {
  return (
    <Switch>
      <Match when={props.channel.type === "TextChannel"}>
        <ServerMemberSidebar channel={props.channel} />
      </Match>
    </Switch>
  );
}

/**
 * Servers to not fetch all members for
 */
const IGNORE_ALL = ["01F7ZSBSFHQ8TA81725KQCSDDP", "01F80118K1F2EYD9XAMCPQ0BCT"];

/**
 * Server Member Sidebar
 */
export function ServerMemberSidebar(props: Props) {
  const client = useClient();
  let scrollTargetElement!: HTMLDivElement;

  onMount(() =>
    props.channel.server?.syncMembers(
      IGNORE_ALL.includes(props.channel.serverId) ? true : false
    )
  );

  // Stage 1: Find roles and members
  const stage1 = createMemo(() => {
    const hoistedRoles = props.channel.server!.orderedRoles.filter(
      (role) => role.hoist
    );

    const members = client().serverMembers.filter(
      (member) => member.id.server === props.channel.serverId
    );

    return [members, hoistedRoles] as const;
  });

  // Stage 2: Filter members by permissions (if necessary)
  const stage2 = createMemo(() => {
    const [members] = stage1();
    if (props.channel.potentiallyRestrictedChannel) {
      return members.filter((member) =>
        member.hasPermission(props.channel, "ViewChannel")
      );
    } else {
      return members;
    }
  });

  // Stage 3: Categorise each member entry into role lists
  const stage3 = createMemo(() => {
    const [, hoistedRoles] = stage1();
    const members = stage2();

    const byRole: Record<string, ServerMember[]> = { default: [], offline: [] };
    hoistedRoles.forEach((role) => (byRole[role.id] = []));

    for (const member of members) {
      if (!member.user?.online) {
        byRole["offline"].push(member);
        continue;
      }

      if (member.roles.length) {
        let assigned;
        for (const hoistedRole of hoistedRoles) {
          if (member.roles.includes(hoistedRole.id)) {
            byRole[hoistedRole.id].push(member);
            assigned = true;
            break;
          }
        }

        if (assigned) continue;
      }

      byRole["default"].push(member);
    }

    return [
      ...hoistedRoles.map((role) => ({
        role,
        members: byRole[role.id],
      })),
      {
        role: {
          id: "default",
          name: "Online",
        },
        members: byRole["default"],
      },
      {
        role: {
          id: "offline",
          name: "Offline",
        },
        members: byRole["offline"],
      },
    ].filter((entry) => entry.members.length);
  });

  // Stage 4: Perform sorting on role lists
  const roles = createMemo(() => {
    const roles = stage3();
    roles.forEach((entry) =>
      entry.members.sort(
        (a, b) =>
          (a.nickname ?? a.user?.displayName)?.localeCompare(
            b.nickname ?? b.user?.displayName ?? ""
          ) || 0
      )
    );

    return roles;
  });

  return (
    <Base
      ref={scrollTargetElement}
      use:scrollable={{
        offsetTop: 48,
        direction: "y",
        showOnHover: true,
      }}
    >
      <div
        style={{
          width: "232px",
        }}
      >
        <CategoryTitle>
          <Row align>
            <UserStatus size="0.7em" status="Online" />
            {
              client().serverMembers.filter(
                (member) =>
                  (member.id.server === props.channel.serverId &&
                    member.user?.online) ||
                  false
              ).length
            }{" "}
            members online
          </Row>
        </CategoryTitle>

        <Deferred>
          <For each={roles()}>
            {(entry) => (
              <div>
                <CategoryTitle>
                  {entry.role.name} {"–"} {entry.members.length}
                </CategoryTitle>

                <VirtualContainer
                  items={entry.members}
                  scrollTarget={scrollTargetElement}
                  itemSize={{ height: 48 }}
                >
                  {(item) => (
                    <div
                      style={{
                        ...item.style,
                        width: "100%",
                        "padding-block": "3px",
                      }}
                    >
                      <Member member={item.item} />
                    </div>
                  )}
                </VirtualContainer>
              </div>
            )}
          </For>
        </Deferred>
      </div>
    </Base>
  );
}

/**
 * Base Styles
 */
const Base = styled.div`
  flex-shrink: 0;
  background: ${(props) => props.theme!.colours["background-100"]};
  width: ${(props) => props.theme!.layout.width["channel-sidebar"]};
`;

/**
 * Category Title
 */
const CategoryTitle = styled.div`
  padding: 16px 14px 4px;
  color: ${(props) => props.theme!.colours["foreground-400"]};
  ${(props) => generateTypographyCSS(props.theme!, "category")}
`;

/**
 * Member
 */
function Member(props: { member: ServerMember }) {
  const t = useTranslation();

  /**
   * Create user information
   */
  const user = () => userInformation(props.member.user!, props.member);

  /**
   * Get user status
   */
  const status = () =>
    props.member.user?.statusMessage((presence) =>
      t(`app.status.${presence.toLowerCase()}`)
    );

  return (
    <div
      use:floating={{
        userCard: {
          user: props.member.user!,
          member: props.member,
        },
      }}
    >
      <MenuButton
        size="normal"
        attention={props.member.user?.online ? "active" : "muted"}
        icon={
          <Avatar
            src={user().avatar}
            size={32}
            holepunch="bottom-right"
            overlay={<UserStatusGraphic status={props.member.user?.presence} />}
          />
        }
      >
        <Column gap="none">
          <OverflowingText>
            <Username username={user().username} colour={user().colour} />
          </OverflowingText>
          <Show when={status()}>
            <Tooltip
              content={() => <TextWithEmoji content={status()!} />}
              placement="top-start"
              aria={status()!}
            >
              <Status>
                <Typography variant="status">
                  <TextWithEmoji content={status()!} />
                </Typography>
              </Status>
            </Tooltip>
          </Show>
        </Column>
      </MenuButton>
    </div>
  );
}

/**
 * Status text
 */
const Status = styled(OverflowingText)`
  color: ${(props) => props.theme!.colours["foreground-400"]};
`;
