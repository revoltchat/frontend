import { Show } from "solid-js";

import { Trans, useLingui } from "@lingui-solid/solid/macro";
import { User } from "revolt.js";

import { Text } from "../design";

import { ProfileCard } from "./ProfileCard";

export function ProfileStatus(props: { user: User }) {
  const { t } = useLingui();

  return (
    <Show when={props.user.status?.text}>
      <ProfileCard>
        <Text class="title" size="large">
          <Trans>Status</Trans>
        </Text>
        <Text class="body">
          {props.user.statusMessage((s) =>
            s === "Online"
              ? t`Online`
              : s === "Busy"
                ? t`Busy`
                : s === "Focus"
                  ? t`Focus`
                  : s === "Idle"
                    ? t`Idle`
                    : t`Offline`,
          )}
        </Text>
      </ProfileCard>
    </Show>
  );
}
