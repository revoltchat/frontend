// import {
//   KeyCombo,
//   KeyComboSequence,
//   KeybindAction,
//   KeybindActions,
//   KeybindSequence,
// } from "@revolt/keybinds";

import { State } from "..";

import { AbstractStore } from ".";

// /** utility to make writing the default keybinds easier, requires all `KeybindAction` values to be filled out */
// function keybindMap(
//   obj: Record<KeybindAction, string[]>,
// ): Record<KeybindAction, KeyComboSequence[]> {
//   const entries = Object.entries(obj) as [KeybindAction, string[]][];
//   const parsed = entries.map(([act, seqs]) => [
//     act,
//     seqs.map((seq) => KeybindSequence.parse(seq)),
//   ]);
//   return Object.fromEntries(parsed);
// }

// export const DEFAULT_VALUES: KeybindActions = keybindMap({
//   [KeybindAction.NavigateChannelUp]: ["Alt+ArrowUp"],
//   [KeybindAction.NavigateChannelDown]: ["Alt+ArrowDown"],
//   // temporary, Control+Alt+ArrowUp does not seem to work on chrome or firefox at the moment
//   [KeybindAction.NavigateServerUp]: ["Control+ArrowUp"],
//   [KeybindAction.NavigateServerDown]: ["Control+ArrowDown"],

//   [KeybindAction.AutoCompleteUp]: ["ArrowUp"],
//   [KeybindAction.AutoCompleteDown]: ["ArrowDown"],
//   [KeybindAction.AutoCompleteSelect]: ["Enter", "Tab"],

//   [KeybindAction.NavigatePreviousContext]: [], //["Escape"],
//   [KeybindAction.NavigatePreviousContextModal]: [],
//   [KeybindAction.NavigatePreviousContextSettings]: [],

//   [KeybindAction.InputForceSubmit]: ["Control+Enter"],
//   [KeybindAction.InputSubmit]: ["Enter"],
//   [KeybindAction.InputCancel]: [], // ["Escape"],

//   [KeybindAction.MessagingMarkChannelRead]: [], // ["Escape"],
//   [KeybindAction.MessagingScrollToBottom]: ["Escape"],
//   [KeybindAction.MessagingEditPreviousMessage]: ["ArrowUp"],

//   [KeybindAction.DeveloperToggleAllExperiments]: [],
// });

export type TypeKeybinds = {
  
};

export class Keybinds extends AbstractStore<"keybinds", TypeKeybinds> {
  /**
   * Construct store
   * @param state State
   */
  constructor(state: State) {
    super(state, "keybinds");
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
  default() {
    return {
    };
  }

  /**
   * Validate the given data to see if it is compliant and return a compliant object
   */
  clean(input: Partial<TypeKeybinds>): TypeKeybinds {
    return { };
  }
}
