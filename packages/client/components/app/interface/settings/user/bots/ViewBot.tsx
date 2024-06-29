import { useClient } from "@revolt/client";
import { createProfileResource } from "@revolt/client/resources";
import { Column } from "@revolt/ui";

import { useSettingsNavigation } from "../../Settings";
import { UserSummary } from "../account";
import { EditProfileButtons } from "../profile/EditProfileButtons";

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
      <UserSummary
        user={bot().user!}
        showBadges
        bannerUrl={profile.data?.animatedBannerURL}
      />
      <EditProfileButtons user={bot().user!} />
      {/* <ErrorBoundary fallback={<>Failed to load profile</>}>
        <Suspense fallback={<>loading...</>}>{profile.data?.content}</Suspense>
      </ErrorBoundary> */}
    </Column>
  );
}
