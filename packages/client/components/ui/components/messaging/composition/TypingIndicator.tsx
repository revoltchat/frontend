import { For, Match, Show, Switch } from "solid-js";
import { styled } from "styled-system/jsx";

import { User } from "revolt.js";

import { useUsers } from "@revolt/markdown/users";

import { Avatar, OverflowingText, typography, Typography } from "../../design";
import { Trans } from "@lingui-solid/solid/macro";

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
          <OverflowingText class={typography({ class: "body", size: "small" })}>
            <Switch fallback={<Trans>Several people are typing…</Trans>}>
              <Match when={users().length === 1}>
                <Trans>{users()[0]!.username} is typing…</Trans>
              </Match>
              <Match when={users().length < 5}>
                <Trans>
                  {users()
                    .slice(0, -1)
                    .map((user) => user!.username)
                    .join(", ")}{" "}
                  and {users().slice(-1)[0]!.username} are typing…
                </Trans>
              </Match>
            </Switch>
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

    // backdropFilter: "var(--effects-blur-md)",
    color: "var(--colours-messaging-indicator-foreground)",
    // background: "var(--colours-messaging-indicator-background)",
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
