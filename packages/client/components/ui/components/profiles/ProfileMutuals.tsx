import { For, Show } from "solid-js";

import { useQuery } from "@tanstack/solid-query";
import { User } from "revolt.js";
import { styled } from "styled-system/jsx";

import { useClient } from "@revolt/client";

import { Avatar, Text } from "../design";

import { ProfileCard } from "./ProfileCard";

export function ProfileMutuals(props: { user: User }) {
  const client = useClient();
  const query = useQuery(() => ({
    queryKey: ["mutual", props.user.id],
    queryFn: async () => {
      if (props.user.self) {
        return {
          users: [],
          groups: [],
        };
      }

      const clnt = client();
      const { users, servers } = await props.user.fetchMutual();

      return {
        users: users
          .map((userId) => clnt.users.get(userId))
          .filter((user) => user),
        groups: [
          ...servers
            .map((serverId) => clnt.servers.get(serverId)!)
            .filter((server) => server),
          ...clnt.channels.filter(
            (channel) =>
              channel.type === "Group" &&
              channel.recipientIds.has(props.user.id),
          ),
        ],
      };
    },
  }));

  return (
    <>
      <Show when={query.data?.users.length}>
        <ProfileCard>
          <Text class="title" size="large">
            Mutuals
          </Text>
          <Grid>
            <For each={query.data?.users}>
              {(user) => (
                <Avatar
                  src={user?.animatedAvatarURL}
                  fallback={user?.displayName}
                  size={20}
                />
              )}
            </For>
          </Grid>
        </ProfileCard>
      </Show>
      <Show when={query.data?.users.length}>
        <ProfileCard>
          <Text class="title" size="large">
            Groups
          </Text>
          <Grid>
            <For each={query.data?.groups}>
              {(group) => (
                <Avatar
                  src={group.animatedIconURL}
                  fallback={group.name}
                  size={20}
                />
              )}
            </For>
          </Grid>
        </ProfileCard>
      </Show>
    </>
  );
}

const Grid = styled("div", {
  base: {
    gap: "var(--gap-md)",
    display: "flex",
    flexWrap: "wrap",
  },
});
