import { Match, Switch } from "solid-js";

import { CategoryButton } from "@revolt/ui";

import { ServerSettingsProps } from ".";

/**
 * Overview
 */
export default function (props: ServerSettingsProps) {
  return (
    <>
      <Switch
        fallback={
          <CategoryButton
            description="Enroll the server into showing on Revolt Discover"
            onClick={() =>
              props.server.edit({ discoverable: true, analytics: true })
            }
          >
            Show on Discover
          </CategoryButton>
        }
      >
        <Match when={props.server.discoverable}>
          <CategoryButton
            description="Remove the server from Discover"
            onClick={() => props.server.edit({ discoverable: false })}
          >
            Show on Discover
          </CategoryButton>
        </Match>
      </Switch>
    </>
  );
}
