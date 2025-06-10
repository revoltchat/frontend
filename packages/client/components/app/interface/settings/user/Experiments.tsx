import { For } from "solid-js";

import { useState } from "@revolt/state";
import {
  AVAILABLE_EXPERIMENTS,
  EXPERIMENTS,
} from "@revolt/state/stores/Experiments";
import { CategoryButton, CategoryButtonGroup, Checkbox } from "@revolt/ui";

/**
 * Experiments
 */
export default function Experiments() {
  const state = useState();

  return (
    <CategoryButtonGroup>
      <For each={AVAILABLE_EXPERIMENTS}>
        {(key) => (
          <CategoryButton
            action={
              <Checkbox
                value={state.experiments.isEnabled(key)}
                onChange={(enabled) =>
                  state.experiments.setEnabled(key, enabled)
                }
              />
            }
            description={EXPERIMENTS[key].description}
            onClick={() => void 0}
          >
            {EXPERIMENTS[key].title}
          </CategoryButton>
        )}
      </For>
    </CategoryButtonGroup>
  );
}
