import { JSX, createMemo } from "solid-js";
import { For, Show } from "solid-js";
import { styled } from "styled-system/jsx";

import { getController } from "@revolt/common";

import {
  Avatar,
  ColouredText,
  Row,
  Text,
  Username,
  UserStatus,
  UserStatusGraphic,
} from "../design";
import { createQuery } from "@tanstack/solid-query";
import { useTranslation } from "@revolt/i18n";

/**
 * Base element for the card
 */
const Base = styled("div", {
  base: {
    color: "white",
    background: "#eee",
    width: "400px",
    height: "400px",

    borderRadius: "var(--borderRadius-lg)",
  },
});

const Banner = styled("div", {
  base: {
    height: "120px",
    padding: "var(--gap-lg)",

    display: "flex",
    flexDirection: "column",
    justifyContent: "end",

    backgroundSize: "cover",
    backgroundPosition: "center",

    borderRadius: "var(--borderRadius-lg)",
  },
});

const UserShort = styled("div", {
  base: {
    gap: "var(--gap-xs)",
    display: "flex",
    flexDirection: "column",
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
    <Base>
      <Banner
        style={{
          "background-image": `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.2)), url('${query.data?.animatedBannerURL}')`,
        }}
      >
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
    </Base>
  );
}
