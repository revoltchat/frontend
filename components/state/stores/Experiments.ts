import { State } from "..";

import { AbstractStore } from ".";

/**
 * Union type of available experiments.
 */
export type Experiment = "file_uploads" | "friends";

/**
 * Currently active experiments.
 */
export const AVAILABLE_EXPERIMENTS: Experiment[] = ["file_uploads", "friends"];

/**
 * Definitions for experiments listed by {@link Experiment}.
 */
export const EXPERIMENTS: {
  [key in Experiment]: { title: string; description: string };
} = {
  file_uploads: {
    title: "File Uploads",
    description: "Enable file uploads when messaging.",
  },
  friends: {
    title: "Friends Menu",
    description: "Enable the friends menu in home.",
  },
};

export interface TypeExperiments {
  enabled: Experiment[];
}

/**
 * Handles enabling and disabling client experiments.
 */
export class Experiments extends AbstractStore<"experiments", TypeExperiments> {
  constructor(state: State) {
    super(state, "experiments");
  }

  hydrate(): void {}

  default(): TypeExperiments {
    return {
      enabled: [],
    };
  }

  clean(input: Partial<TypeExperiments>): TypeExperiments {
    let enabled: Set<Experiment> = new Set();

    if (input.enabled) {
      for (const entry of input.enabled) {
        if (AVAILABLE_EXPERIMENTS.includes(entry)) {
          enabled.add(entry);
        }
      }
    }

    return {
      enabled: [...enabled],
    };
  }

  /**
   * Check if an experiment is enabled.
   * @param experiment Experiment
   */
  isEnabled(experiment: Experiment) {
    return import.meta.env.DEV || this.get().enabled.includes(experiment);
  }

  /**
   * Enable an experiment.
   * @param experiment Experiment
   */
  enable(experiment: Experiment) {
    if (!this.isEnabled(experiment)) {
      this.set("enabled", (enabled) => [...enabled, experiment]);
    }
  }

  /**
   * Disable an experiment.
   * @param experiment Experiment
   */
  disable(experiment: Experiment) {
    if (!this.isEnabled(experiment)) {
      this.set("enabled", (enabled) =>
        enabled.filter((entry) => entry !== experiment)
      );
    }
  }

  /**
   * Set the state of an experiment.
   * @param key Experiment
   * @param enabled Whether this experiment is enabled.
   */
  setEnabled(key: Experiment, enabled: boolean): void {
    if (enabled) {
      this.enable(key);
    } else {
      this.disable(key);
    }
  }

  /**
   * Reset and disable all experiments.
   */
  reset() {
    this.set("enabled", []);
  }
}
