import { JSX, createMemo } from "solid-js";
import { For, Show } from "solid-js";
import { styled } from "styled-system/jsx";

import { getController } from "@revolt/common";

import {
  Avatar,
  Button,
  ColouredText,
  Row,
  Text,
  typography,
  Username,
  UserStatus,
  UserStatusGraphic,
} from "../design";
import { createQuery } from "@tanstack/solid-query";
import { useTranslation } from "@revolt/i18n";
import { cva } from "styled-system/css";
import { Ripple } from "../material";

import MdMoreVert from "@material-design-icons/svg/filled/more_vert.svg?component-solid";
import { UserContextMenu } from "@revolt/app";

/**
 * Base element for the card
 */
const base = cva({
  base: {
    // padding: "var(--gap-md)",

    color: "white",
    background: "var(--md-sys-color-surface)",
    boxShadow: "0 0 6px var(--colours-component-context-menu-shadow)",

    width: "280px",
    height: "400px",

    borderRadius: "var(--borderRadius-xl)",
  },
});

const Banner = styled("div", {
  base: {
    position: "relative",
    userSelect: "none",
    cursor: "pointer",

    gridColumn: "1 / 3",

    height: "120px",
    padding: "var(--gap-lg)",

    display: "flex",
    flexDirection: "column",
    justifyContent: "end",

    backgroundSize: "cover",
    backgroundPosition: "center",

    borderRadius: "var(--borderRadius-xl)",
  },
});

const UserShort = styled("div", {
  base: {
    gap: "var(--gap-xs)",
    display: "flex",
    flexDirection: "column",
  },
});

const Grid = styled("div", {
  base: {
    display: "grid",
    gap: "var(--gap-md)",
    padding: "var(--gap-md)",
    gridTemplateColumns: "repeat(2, 1fr)",
  },
});

const Actions = styled("div", {
  base: {
    gridColumn: "1 / 3",

    display: "flex",
    gap: "var(--gap-md)",
    justifyContent: "flex-end",
  },
});

const ProfileCard = styled("div", {
  base: {
    position: "relative",
    userSelect: "none",
    cursor: "pointer",

    color: "var(--md-sys-color-on-surface-variant)",
    background: "var(--md-sys-color-surface-variant)",
    aspectRatio: "1/1",
    padding: "var(--gap-md)",
    borderRadius: "var(--borderRadius-lg)",

    display: "flex",
    flexDirection: "column",
  },

  variants: {
    wide: {
      true: {
        gridColumn: "1 / 3",
      },
    },
  },
});

const Role = styled("span", {
  base: {
    flexGrow: 1,
    ...typography.raw({ class: "label" }),
  },
});

const RoleIcon = styled("div", {
  base: {
    width: "8px",
    height: "8px",
    borderRadius: "100%",
  },
});

/**
 * User Card
 */
export function UserCard(
  props: JSX.Directives["floating"]["userCard"] & object
) {
  const t = useTranslation();

  const query = createQuery(() => ({
    queryKey: ["profile", props.user.id],
    queryFn: () => props.user.fetchProfile(),
  }));

  const roleIds = createMemo(
    () => new Set(props.member?.orderedRoles.map((role) => role.id))
  );

  // Disable it while it's being developed
  if (!getController("state").experiments.isEnabled("user_card")) return null;

  return (
    <div use:scrollable={{ showOnHover: true, class: base() }}>
      <Grid>
        <Banner
          style={{
            "background-image": `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.2)), url('${query.data?.animatedBannerURL}')`,
          }}
        >
          <Ripple />

          <Row align gap="lg">
            <Avatar
              src={props.user.animatedAvatarURL}
              size={48}
              holepunch="bottom-right"
              overlay={<UserStatusGraphic status={props.user.presence} />}
            />
            <UserShort>
              <Text>{props.member?.displayName ?? props.user.displayName}</Text>
              <Text class="label" size="small">
                {props.user.username}#{props.user.discriminator}
              </Text>
              <Text class="_status">
                {props.user.statusMessage((s) =>
                  t(`app.status.${s.toLowerCase() as "focus"}`)
                )}
              </Text>
            </UserShort>
          </Row>
        </Banner>

        <Actions>
          <Button>Add Friend</Button>
          <Button size="icon">
            <MdMoreVert />
          </Button>
        </Actions>

        <ProfileCard>
          <Ripple />
          <Text class="title" size="large">
            Roles
          </Text>
          <div use:invisibleScrollable>
            <For each={props.member!.orderedRoles.toReversed()}>
              {(role) => (
                <Row align>
                  <Role>{role.name}</Role>
                  <RoleIcon
                    style={{
                      "background-color":
                        role.colour ?? "var(--colours-foreground)",
                    }}
                  />
                </Row>
                // <div
                //   onClick={() =>
                //     props.member!.edit({
                //       roles: [...roleIds()].filter((id) => id !== role.id),
                //     })
                //   }
                // >
                //   <ColouredText
                //     colour={role.colour!}
                //     clip={role.colour?.includes("gradient")}
                //   >
                //     {role.name}
                //   </ColouredText>
                // </div>
              )}
            </For>
          </div>
        </ProfileCard>
        <ProfileCard>
          <Text class="title" size="large">
            Joined
          </Text>
          <Text class="label">Account Created</Text>
          <Text>date</Text>
          <Text class="label">Member Since</Text>
          <Text>date</Text>
        </ProfileCard>
        <ProfileCard>
          <Text class="title" size="large">
            Badges
          </Text>
        </ProfileCard>
        <ProfileCard>
          <Text class="title" size="large">
            Status
          </Text>
        </ProfileCard>
        <ProfileCard wide>
          <Text class="title" size="large">
            Bio
          </Text>
        </ProfileCard>

        {/* TODO: MUTUALS */}
      </Grid>

      {/* <Show when={props.member}>
        <Username
          username={props.member!.nickname ?? props.user.username}
          colour={props.member!.roleColour!}
        />
        <br />
      </Show>
      {props.user.username}
      <Show when={props.member}>
        <br />
        <br />
        <For each={props.member!.orderedRoles}>
          {(role) => (
            <div
              onClick={() =>
                props.member!.edit({
                  roles: [...roleIds()].filter((id) => id !== role.id),
                })
              }
            >
              <ColouredText
                colour={role.colour!}
                clip={role.colour?.includes("gradient")}
              >
                {role.name}
              </ColouredText>
            </div>
          )}
        </For>
        <br />
        <Row wrap>
          <For
            each={props.member?.server?.orderedRoles.filter(
              (role) => !roleIds().has(role.id)
            )}
          >
            {(role) => (
              <span
                onClick={() =>
                  props.member!.edit({
                    roles: [...roleIds(), role.id],
                  })
                }
              >
                <ColouredText
                  colour={role.colour!}
                  clip={role.colour?.includes("gradient")}
                >
                  {role.name}
                </ColouredText>
              </span>
            )}
          </For>
        </Row>
      </Show> */}
    </div>
  );
}
