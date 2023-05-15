import { BiRegularAbacus, BiRegularGlobe } from "solid-icons/bi";
import { Show } from "solid-js";

import { useClient } from "@revolt/client";
import { CategoryButton, Checkbox, Column, Typography } from "@revolt/ui";

import { ServerSettingsProps } from ".";

/**
 * Server overview
 */
export default function ServerOverview(props: ServerSettingsProps) {
  const user = useClient();

  return (
    <Column gap="xl">
      <Show when={user().user?.privileged}>
        <Column>
          <Typography variant="label">Platform</Typography>
          <label>
            <CategoryButton
              description="Message counts will be collected for server"
              icon={<BiRegularAbacus size={24} />}
              action={
                <Checkbox
                  value={props.server.analytics}
                  onChange={(analytics) =>
                    props.server.edit({
                      analytics,
                    })
                  }
                />
              }
              onClick={() => void 0}
            >
              Analytics
            </CategoryButton>
          </label>
          <label>
            <CategoryButton
              description="Server can be joined from Discover"
              icon={<BiRegularGlobe size={24} />}
              action={
                <Checkbox
                  value={props.server.discoverable}
                  onChange={(discoverable) =>
                    props.server.edit({
                      discoverable,
                    })
                  }
                />
              }
              onClick={() => void 0}
            >
              Public Server
            </CategoryButton>
          </label>
        </Column>
      </Show>
    </Column>
  );
}
