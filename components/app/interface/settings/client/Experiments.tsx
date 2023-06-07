import { For } from "solid-js";

import { state } from "@revolt/state";
import {
  AVAILABLE_EXPERIMENTS,
  EXPERIMENTS,
} from "@revolt/state/stores/Experiments";
import { CategoryButton, CategoryButtonGroup, Checkbox, Column, FormGroup } from "@revolt/ui";

/**
 * Experiments
 */
export default function Experiments() {
  return (
    <Column>
      <CategoryButtonGroup>
        <For each={AVAILABLE_EXPERIMENTS}>
          {(key) => (
            <FormGroup>
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
            </FormGroup>
          )}
        </For>
      </CategoryButtonGroup>
    </Column>
  );
}
