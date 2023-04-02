import { State } from "..";

import { AbstractStore } from ".";

/**
 * Union type of available experiments.
 */
export type Experiment =
  | "file_uploads"
  | "friends"
  | "account_switcher"
  | "gif_picker"
  | "emoji_picker";

/**
 * Currently active experiments.
 */
export const AVAILABLE_EXPERIMENTS: Experiment[] = [
  "file_uploads",
  "friends",
  "account_switcher",
  "gif_picker",
  "emoji_picker",
];

/**
 * Always-on development-mode experiments.
 */
export const ALWAYS_ON_DEVELOPMENT_EXPERIMENTS: Experiment[] = [
  "file_uploads",
  "friends",
  "gif_picker",
];

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
  account_switcher: {
    title: "Account Switcher",
    description: "Enable the account switcher on the login page.",
  },
  gif_picker: {
    title: "GIF Picker",
    description: "Search and send GIFs from GIFBox!",
  },
  emoji_picker: {
    title: "Emoji Picker",
    description: "Search and add emoji to your messages.",
  },
};

export interface TypeExperiments {
  /**
   * List of enabled experiments
   */
  enabled: Experiment[];
}

/**
 * Handles enabling and disabling client experiments.
 */
export class Experiments extends AbstractStore<"experiments", TypeExperiments> {
  constructor(state: State) {
    super(state, "experiments");
  }

  hydrate(): void {
    /** nothing needs to be done */
  }

  default(): TypeExperiments {
    return {
      enabled: [],
    };
  }

  clean(input: Partial<TypeExperiments>): TypeExperiments {
    const enabled: Set<Experiment> = new Set();

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
    return (
      (import.meta.env.DEV &&
        ALWAYS_ON_DEVELOPMENT_EXPERIMENTS.includes(experiment)) ||
      this.get().enabled.includes(experiment)
    );
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
