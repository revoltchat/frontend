import { JSX } from "solid-js";

import { useQuery } from "@tanstack/solid-query";
import { cva } from "styled-system/css";
import { styled } from "styled-system/jsx";

import { useModals } from "@revolt/modal";

import {
  ProfileActions,
  ProfileBadges,
  ProfileBanner,
  ProfileBio,
  ProfileRoles,
  ProfileStatus,
} from "../profiles";
import { ProfileJoined } from "../profiles/ProfileJoined";

/**
 * Base element for the card
 */
const base = cva({
  base: {
    // padding: "var(--gap-md)",

    color: "var(--md-sys-color-on-surface)",
    background: "var(--md-sys-color-surface-container-high)",
    boxShadow: "0 0 6px var(--colours-component-context-menu-shadow)",

    width: "340px",
    height: "400px",

    borderRadius: "var(--borderRadius-xl)",
  },
});

/**
 * User Card
 */
export function UserCard(
  props: JSX.Directives["floating"]["userCard"] &
    object & { onClose: () => void },
) {
  const { openModal } = useModals();
  const query = useQuery(() => ({
    queryKey: ["profile", props.user.id],
    queryFn: () => props.user.fetchProfile(),
  }));

  function openFull() {
    openModal({ type: "user_profile", user: props.user });
    props.onClose();
  }

  return (
    <div use:invisibleScrollable={{ class: base() }}>
      <Grid>
        <ProfileBanner
          width={2}
          user={props.user}
          member={props.member}
          bannerUrl={query.data?.animatedBannerURL}
          onClick={openFull}
        />

        <ProfileActions user={props.user} member={props.member} width={2} />
        <ProfileRoles member={props.member} />
        <ProfileBadges user={props.user} />
        <ProfileStatus user={props.user} />
        <ProfileJoined user={props.user} member={props.member} />
        <ProfileBio content={query.data?.content} onClick={openFull} />

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

const Grid = styled("div", {
  base: {
    display: "grid",
    gap: "var(--gap-md)",
    padding: "var(--gap-md)",
    gridTemplateColumns: "repeat(2, 1fr)",
  },
});
