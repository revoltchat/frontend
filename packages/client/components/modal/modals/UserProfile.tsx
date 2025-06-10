import { useQuery } from "@tanstack/solid-query";
import { styled } from "styled-system/jsx";

import { Modal2, Modal2Props, Profile } from "@revolt/ui";

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
        <Profile.Banner
          width={3}
          user={props.user}
          bannerUrl={query.data?.animatedBannerURL}
        />

        <Profile.Actions user={props.user} width={3} />
        <Profile.Status user={props.user} />
        <Profile.Badges user={props.user} />
        <Profile.Joined user={props.user} />
        <Profile.Mutuals user={props.user} />
        <Profile.Bio content={query.data?.content} full />
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
