import { For } from "solid-js";

import { useState } from "@revolt/state";
import {
  AVAILABLE_EXPERIMENTS,
  EXPERIMENTS,
} from "@revolt/state/stores/Experiments";
import { CategoryButton, Checkbox } from "@revolt/ui";

/**
 * Experiments
 */
export default function Experiments() {
  const state = useState();

  return (
    <CategoryButton.Group>
      <For each={AVAILABLE_EXPERIMENTS}>
        {(key) => (
          <CategoryButton
            action={<Checkbox checked={state.experiments.isEnabled(key)} />}
            description={EXPERIMENTS[key].description}
            onClick={() =>
              state.experiments.setEnabled(
                key,
                !state.experiments.isEnabled(key),
              )
            }
          >
            {EXPERIMENTS[key].title}
          </CategoryButton>
        )}
      </For>
    </CategoryButton.Group>
  );
}
