import { Show } from "solid-js";

import dayjs from "dayjs";
import { User } from "revolt.js";
import { styled } from "styled-system/jsx";

import { Avatar, Button, CategoryButtonGroup, iconSize } from "@revolt/ui";

import MdCakeFill from "@material-design-icons/svg/filled/cake.svg?component-solid";
import MdEdit from "@material-design-icons/svg/outlined/edit.svg?component-solid";

export function UserSummary(props: { user: User; onEdit?: () => void }) {
  return (
    <CategoryButtonGroup>
      <AccountBox>
        <ProfileDetails>
          <Avatar src={props.user.animatedAvatarURL} size={58} />
          <Username>
            <span>{props.user.displayName}</span>
            <span>
              {props.user.username}#{props.user.discriminator}
            </span>
          </Username>
          <Show when={props.onEdit}>
            <Button size="fab" onPress={props.onEdit}>
              <MdEdit />
            </Button>
          </Show>
        </ProfileDetails>
        <BottomBar>
          <DummyPadding />
          {/* <ProfileBadges>
              <MdDraw {...iconSize(20)} />
              <MdDraw {...iconSize(20)} />
              <MdDraw {...iconSize(20)} />
            </ProfileBadges> */}
          <ProfileBadges>
            <span
              use:floating={{
                tooltip: {
                  placement: "top",
                  content: dayjs(props.user.createdAt).format(
                    "[Account created] Do MMMM YYYY [at] HH:mm"
                  ),
                },
              }}
            >
              <MdCakeFill {...iconSize(18)} />
            </span>
          </ProfileBadges>
        </BottomBar>

        {/* <div class="column">
        <div class="row">
          <ProfileDetails>
            <div class="usernameDetails">
              {client().user!.displayName}
              <div class="username">
                {client().user!.username}#{client().user!.discriminator}
              </div>
            </div>
          </ProfileDetails>
          <a class="button" onClick={() => navigate("profile")}>
            <MdEdit {...iconSize(22)} />
          </a>
        </div>
        <BadgeContainer>
          {/* <ProfileBadges>
        <MdDraw {...iconSize(20)} />
        <MdDraw {...iconSize(20)} />
        <MdDraw {...iconSize(20)} />
      </ProfileBadges> 
          <ProfileBadges>
            <span
              use:floating={{
                tooltip: {
                  placement: "top",
                  content: dayjs(client().user!.createdAt).format(
                    "[Account created] Do MMMM YYYY [at] HH:mm"
                  ),
                },
              }}
            >
              <MdCakeFill {...iconSize(18)} />
            </span>
          </ProfileBadges>
        </BadgeContainer>
      </div> */}
      </AccountBox>
    </CategoryButtonGroup>
  );
}

const AccountBox = styled("div", {
  base: {
    display: "flex",
    padding: "var(--gap-lg)",
    flexDirection: "column",

    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), url("https://autumn.revolt.chat/backgrounds/PA-U1R3u-iw72V-WH0C9aDN1rBTbnm-sKNR8YN4RL8?width=1000");`,
  },
});

const ProfileDetails = styled("div", {
  base: {
    display: "flex",
    gap: "var(--gap-lg)",
    alignItems: "center",
  },
});

const Username = styled("div", {
  base: {
    flexGrow: 1,

    display: "flex",
    flexDirection: "column",

    // Display Name
    "& :nth-child(1)": {
      fontSize: "18px",
      fontWeight: 600,
    },

    // Username#Discrim
    "& :nth-child(2)": {
      fontSize: "14px",
      fontWeight: 400,
    },
  },
});

const BottomBar = styled("div", {
  base: {
    display: "flex",
  },
});

const DummyPadding = styled("div", {
  base: {
    flexShrink: 0,
    // Matches with avatar size
    width: "58px",
    // Matches with ProfileDetails
    marginInlineEnd: "var(--gap-lg)",
  },
});

const ProfileBadges = styled("div", {
  base: {
    display: "flex",
    gap: "var(--gap-sm)",
    width: "fit-content",
    padding: "var(--gap-sm) var(--gap-sm)",
    borderRadius: "var(--borderRadius-md)",

    background: "var(--colours-settings-background)",
  },
});
