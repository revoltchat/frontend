import { For } from "solid-js";

import { state } from "@revolt/state";
import {
  AVAILABLE_EXPERIMENTS,
  EXPERIMENTS,
} from "@revolt/state/stores/Experiments";
import { Checkbox, Column } from "@revolt/ui";

/**
 * Experiments
 */
export default function () {
  return (
    <Column>
      <For each={AVAILABLE_EXPERIMENTS}>
        {(key) => (
          <Checkbox
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
