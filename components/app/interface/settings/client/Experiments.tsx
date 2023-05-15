import { For } from "solid-js";

import { state } from "@revolt/state";
import {
  AVAILABLE_EXPERIMENTS,
  EXPERIMENTS,
} from "@revolt/state/stores/Experiments";
import { Column, LegacyCheckbox } from "@revolt/ui";

/**
 * Experiments
 */
export default function () {
  return (
    <Column>
      <For each={AVAILABLE_EXPERIMENTS}>
        {(key) => (
          <LegacyCheckbox
            value={state.experiments.isEnabled(key)}
            onChange={(enabled) => state.experiments.setEnabled(key, enabled)}
            title={EXPERIMENTS[key].title}
            description={EXPERIMENTS[key].description}
          />
        )}
      </For>
    </Column>
  );
}
