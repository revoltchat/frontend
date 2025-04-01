import { Trans } from "@lingui-solid/solid/macro";
import { Bot } from "revolt.js";

import { createProfileResource } from "@revolt/client/resources";
import {
  CategoryButton,
  CategoryButtonGroup,
  Column,
  iconSize,
} from "@revolt/ui";

import MdLink from "@material-design-icons/svg/outlined/link.svg?component-solid";
import MdPersonAdd from "@material-design-icons/svg/outlined/person_add.svg?component-solid";
import MdPublic from "@material-design-icons/svg/outlined/public.svg?component-solid";
import MdToken from "@material-design-icons/svg/outlined/token.svg?component-solid";

import { UserSummary } from "../account/index";
import { EditProfileButtons } from "../profile/EditProfileButtons";

/**
 * View a specific bot
 */
export function ViewBot(props: { bot: Bot }) {
  // `bot` will never change, so we don't care about reactivity here
  // eslint-disable-next-line solid/reactivity
  const profile = createProfileResource(props.bot.user!);

  return (
    <Column gap="lg">
      <UserSummary
        user={props.bot.user!}
        showBadges
        bannerUrl={profile.data?.animatedBannerURL}
      />
      <EditProfileButtons user={props.bot.user!} />
      {/* <ErrorBoundary fallback={<>Failed to load profile</>}>
        <Suspense fallback={<>loading...</>}>{profile.data?.content}</Suspense>
      </ErrorBoundary> */}

      <CategoryButtonGroup>
        <CategoryButton
          description={
            <Trans>Generate a new token if it gets lost or compromised</Trans>
          }
          icon={<MdToken {...iconSize(22)} />}
          action="chevron"
        >
          <Trans>Reset Token</Trans>
        </CategoryButton>
        <CategoryButton
          description={
            <Trans>
              Allow others to add your bot to their servers from Discover
            </Trans>
          }
          icon={<MdPublic {...iconSize(22)} />}
          action="chevron"
        >
          <Trans>Submit to Discover</Trans>
        </CategoryButton>
      </CategoryButtonGroup>

      <CategoryButtonGroup>
        <CategoryButton icon={<MdLink {...iconSize(22)} />} action="copy">
          <Trans>Copy Invite</Trans>
        </CategoryButton>
        <CategoryButton
          icon={<MdPersonAdd {...iconSize(22)} />}
          action="chevron"
        >
          <Trans>Invite Bot</Trans>
        </CategoryButton>
      </CategoryButtonGroup>
    </Column>
  );
}
