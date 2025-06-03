import { useQuery } from "@tanstack/solid-query";
import { styled } from "styled-system/jsx";

import {
  Modal2,
  Modal2Props,
  ProfileActions,
  ProfileBadges,
  ProfileBanner,
  ProfileBio,
  ProfileJoined,
  ProfileMutuals,
  ProfileStatus,
} from "@revolt/ui";

import { Modals } from "../types";

export function UserProfileModal(
  props: Modal2Props & Modals & { type: "user_profile" },
) {
  const query = useQuery(() => ({
    queryKey: ["profile", props.user.id],
    queryFn: () => props.user.fetchProfile(),
  }));

  return (
    <Modal2
      show={props.show}
      onClose={props.onClose}
      minWidth={560}
      padding={8}
    >
      <Grid>
        <ProfileBanner
          width={3}
          user={props.user}
          bannerUrl={query.data?.animatedBannerURL}
        />

        <ProfileActions user={props.user} width={3} />
        <ProfileStatus user={props.user} />
        <ProfileBadges user={props.user} />
        <ProfileJoined user={props.user} />
        <ProfileMutuals user={props.user} />
        <ProfileBio content={query.data?.content} full />
      </Grid>
    </Modal2>
  );
}

const Grid = styled("div", {
  base: {
    display: "grid",
    gap: "var(--gap-md)",
    padding: "var(--gap-md)",
    gridTemplateColumns: "repeat(3, 1fr)",
  },
});
