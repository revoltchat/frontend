import { useQuery } from "@tanstack/solid-query";
import { styled } from "styled-system/jsx";

import { Dialog, DialogProps, Profile } from "@revolt/ui";

import { Modals } from "../types";

export function UserProfileModal(
  props: DialogProps & Modals & { type: "user_profile" },
) {
  const query = useQuery(() => ({
    queryKey: ["profile", props.user.id],
    queryFn: () => props.user.fetchProfile(),
  }));

  return (
    <Dialog
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
    </Dialog>
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
