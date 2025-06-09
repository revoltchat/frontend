import { Accessor, createSignal } from "solid-js";

import { State } from "..";

import { AbstractStore } from ".";

export type TypeTheme =
  | {
      preset: "neutral";
      mode: "light" | "dark" | "system";
    }
  | {
      preset: "you";
      accent: string;
      mode: "light" | "dark" | "system";
    };

export type SelectedTheme =
  | {
      preset: "neutral";
      darkMode: boolean;
    }
  | {
      preset: "you";
      accent: string;
      darkMode: boolean;
    };

/**
 * Manages theme information
 */
export class Theme extends AbstractStore<"theme", TypeTheme> {
  prefersDark: Accessor<boolean>;

  /**
   * Construct store
   * @param state State
   */
  constructor(state: State) {
    super(state, "theme");

    // handle prefers-color-scheme value and changes
    const [prefersDark, setPrefersDark] = createSignal(
      window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches,
    );

    this.prefersDark = prefersDark;

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (event) => setPrefersDark(event.matches));
  }

  /**
   * Hydrate external context
   */
  hydrate(): void {
    /** nothing needs to be done */
  }

  /**
   * Generate default values
   */
  default(): TypeTheme {
    return {
      preset: "you",
      // preset: "neutral",
      mode: "light",
      accent: "#FF5733",
    };
  }

  /**
   * Validate the given data to see if it is compliant and return a compliant object
   */
  clean(input: Partial<TypeTheme>): TypeTheme {
    return this.default(); // todo
  }

  /**
   * Get the currently selected theme (considering system settings)
   */
  get activeTheme(): SelectedTheme {
    const opts = this.get();

    switch (opts.preset) {
      case "neutral":
        return {
          preset: "neutral",
          darkMode:
            opts.mode === "dark" ||
            (opts.mode === "system" && this.prefersDark()),
        };
      case "you":
        return {
          preset: "you",
          accent: opts.accent,
          darkMode:
            opts.mode === "dark" ||
            (opts.mode === "system" && this.prefersDark()),
        };
    }
  }
}
