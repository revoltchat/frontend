import { For, Match, Show, Switch } from "solid-js";
import { styled } from "styled-system/jsx";

import { User } from "revolt.js";

import { useTranslation } from "@revolt/i18n";
import { useUsers } from "@revolt/markdown/users";

import { Avatar, OverflowingText, Typography } from "../../design";

interface Props {
  /**
   * Users who are typing
   */
  users: (User | undefined)[];

  /**
   * Own user ID
   */
  ownId: string;
}

/**
 * Display typing user information
 */
export function TypingIndicator(props: Props) {
  const t = useTranslation();

  /**
   * Generate list of user IDs
   * @returns User IDs
   */
  const userIds = () =>
    (
      props.users.filter(
        (user) =>
          typeof user !== "undefined" &&
          user.id !== props.ownId &&
          user.relationship !== "Blocked"
      ) as User[]
    )
      .sort((a, b) => a!.id.toUpperCase().localeCompare(b!.id.toUpperCase()))
      .map((user) => user.id);

  const users = useUsers(userIds, true);

  return (
    <Show when={users().length}>
      <Base>
        <Bar>
          <Avatars>
            <For each={users()}>
              {(user, index) => (
                <Avatar
                  src={user!.avatar}
                  size={15}
                  holepunch={
                    index() + 1 < users().length ? "overlap-subtle" : "none"
                  }
                />
              )}
            </For>
          </Avatars>
          <OverflowingText>
            <Typography variant="composition-typing-indicator">
              <Switch fallback={t("app.main.channel.typing.several")}>
                <Match when={users().length === 1}>
                  {t("app.main.channel.typing.single", {
                    user: users()[0]!.username,
                  })}
                </Match>
                <Match when={users().length < 5}>
                  {t("app.main.channel.typing.multiple", {
                    user: users().slice(-1)[0]!.username,
                    userlist: users()
                      .slice(0, -1)
                      .map((user) => user!.username)
                      .join(", "),
                  })}
                </Match>
              </Switch>
            </Typography>
          </OverflowingText>
        </Bar>
      </Base>
    </Show>
  );
}

/**
 * Avatar alignment
 */
const Avatars = styled("div", {
  base: {
    display: "flex",
    flexShrink: 0,
    height: "fit-content",

    "& :not(:first-child)": {
      marginInlineStart: "-6px",
    },
  },
});

/**
 * Styles for the typing indicator
 */
const Bar = styled("div", {
  base: {
    bottom: 0,
    width: "100%",
    height: "26px",
    position: "absolute",

    padding: "0 var(--gap-lg)",
    borderRadius: "var(--borderRadius-lg)",

    display: "flex",
    gap: "var(--gap-md)",

    userSelect: "none",
    alignItems: "center",
    flexDirection: "row",

    backdropFilter: "var(--effects-blur-md)",
    color: "var(--colours-messaging-indicator-foreground)",
    background: "var(--colours-messaging-indicator-background)",
  },
});

/**
 * Position relatively to this space
 */
const Base = styled("div", {
  base: {
    position: "relative",
  },
});
