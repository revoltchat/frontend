import { ErrorBoundary, Suspense } from "solid-js";

import { createQuery } from "@tanstack/solid-query";

import { useClient } from "@revolt/client";
import { createProfileResource } from "@revolt/client/resources";
import { Column } from "@revolt/ui";

import { useSettingsNavigation } from "../../Settings";
import { UserSummary } from "../account";

/**
 * View a specific bot
 */
export function ViewBot() {
  const client = useClient();
  const { page } = useSettingsNavigation();

  const bot = () => client().bots.get(page()!.substring("bots/".length))!;
  const profile = createProfileResource(bot().user!);

  return (
    <Column gap="lg">
      <UserSummary user={bot().user!} />
      <ErrorBoundary fallback={<>Failed to load profile</>}>
        <Suspense fallback={<>loading...</>}>{profile.data?.content}</Suspense>
      </ErrorBoundary>
    </Column>
  );
}
