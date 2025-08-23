import { Suspense, createMemo } from "solid-js";

import { useNavigate } from "@solidjs/router";
import { useMutation, useQuery } from "@tanstack/solid-query";
import { PublicChannelInvite, ServerPublicInvite } from "revolt.js";
import { styled } from "styled-system/jsx";

import { useClient } from "@revolt/client";
import { useModals } from "@revolt/modal";
import {
  Avatar,
  Button,
  CircularProgress,
  Text,
} from "@revolt/ui/components/design";
import { Column } from "@revolt/ui/components/layout";

interface Props {
  code: string;
}

export function Invite(props: Props) {
  const client = useClient();
  const navigate = useNavigate();
  const { showError } = useModals();

  const query = useQuery(() => ({
    queryKey: ["invite", props.code],
    queryFn: () =>
      client()
        .api.get(`/invites/${props.code as ""}`)
        .then((invite) => PublicChannelInvite.from(client(), invite)),

    refetchInterval: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  }));

  const joined = createMemo(() => {
    if (!(query.data instanceof ServerPublicInvite)) return false;
  
    return client().servers?.has(query.data.serverId) ?? false;
  });

  const join = useMutation(() => ({
    mutationFn: () => (query.data as ServerPublicInvite).join(),
    onSuccess(server) {
      navigate(server.path);
    },
    onError: showError,
  }));

  return (
    <Base>
      <Suspense fallback={<CircularProgress />}>
        <Avatar
          size={42}
          src={
            query.data instanceof ServerPublicInvite
              ? query.data.serverIcon?.url
              : undefined
          }
          fallback={
            query.data instanceof ServerPublicInvite
              ? query.data.serverName
              : undefined
          }
        />
        <Column gap="none" grow>
          <Text class="title" size="small">
            {query.data instanceof ServerPublicInvite
              ? query.data.serverName
              : undefined}
          </Text>
          <Text class="label">
            {query.data instanceof ServerPublicInvite
              ? query.data.memberCount
              : undefined}{" "}
            members
          </Text>
        </Column>
        <Button onPress={() => join.mutate()} isDisabled={join.isPending || joined()}>
          {joined() ? "Joined" : "Join"}
        </Button>
      </Suspense>
    </Base>
  );
}

const Base = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",

    width: "320px",
    height: "64px",
    gap: "var(--gap-md)",
    padding: "var(--gap-md)",
    borderRadius: "var(--borderRadius-md)",

    color: "var(--md-sys-color-on-secondary-container)",
    background: "var(--md-sys-color-secondary-container)",
  },
});
