import { debounce } from "@revolt/common";

// note: order dependent!
export const KEYBINDING_MODIFIER_KEYS = ["Control", "Alt", "Meta", "Shift"];

/**
 * Keys that must be pressed at the same time, order should not matter.
 * Should only be include modifiers and one key at the moment.
 */
export type KeyCombo = string[];

export type KeySequence = KeyCombo[];

export type Keybinding = {
  sequence: KeySequence;
};

export const KeyCombo = {
  fromKeyboardEvent(event: KeyboardEvent): KeyCombo {
    const pressed = KEYBINDING_MODIFIER_KEYS.filter((key) =>
      event.getModifierState(key)
    );

    if (!KEYBINDING_MODIFIER_KEYS.includes(event.key)) {
      pressed.push(event.key.replace(" ", "Space"));
    }

    return pressed;
  },

  // todo: add matches function to better handle browser inconsistencies
  matches(keyComboA: KeyCombo, keyComboB: KeyCombo) {
    return (
      keyComboA.length == keyComboB.length &&
      keyComboA.every((key, i) => key == keyComboB[i])
    );
  },
};

export const KeybindSequence = {
  /**
   * Parse a stringified keybind seqeuence.
   *
   * @example
   * ```
   * parse('Alt+ArrowUp')
   * parse('Control+k b')
   * ```
   */
  parse(sequence: string): KeyCombo[] {
    return sequence.split(" ").map((expr) => expr.split("+"));
  },

  /** Stringify a keybind sequence */
  stringify(sequence: KeyCombo[]) {
    return sequence.map((combo) => combo.join("+")).join(" ");
  },
};

// type KeybindEvent = KeyboardEvent & { readonly action: string }

export class KeybindEvent<T> extends KeyboardEvent {
  constructor(public action: T, eventInitDict?: KeyboardEventInit | undefined) {
    super("keybind", eventInitDict);
  }
}

export class KeybindState<KeybindAction extends string> extends EventTarget {
  keybinds = new Map<KeybindAction, Keybinding[]>();
  possibleSequences = new Map<Keybinding, KeyCombo[]>();

  resetPossibleSequences = () =>
    debounce(() => this.possibleSequences.clear(), 1000);

  handleEvent(event: Event) {
    if (!(event instanceof KeyboardEvent)) return;
    if (event.repeat) return;

    const combo = KeyCombo.fromKeyboardEvent(event);

    this.keybinds.forEach((keybindings, action) => {
      keybindings.forEach((keybinding) => {
        // skip unassigned keybinds
        if (keybinding.sequence.length === 0) return;

        const expectedSequence =
          this.possibleSequences.get(keybinding) ?? keybinding.sequence;

        const matched = KeyCombo.matches(expectedSequence[0], combo);

        if (matched) {
          if (expectedSequence.length > 1) {
            this.possibleSequences.set(keybinding, expectedSequence.slice(1));
          } else {
            this.possibleSequences.delete(keybinding);
            this.dispatchEvent(new KeybindEvent(action, event));
          }
        } else if (KEYBINDING_MODIFIER_KEYS.includes(event.key)) {
          this.possibleSequences.delete(keybinding);
        }
      });
    });

    this.resetPossibleSequences();
  }

  // todo: use typed event target, internal events, or solid events?
  declare addEventListener: (
    type: KeybindAction,
    callback:
      | ((event: KeybindEvent<KeybindAction>) => void)
      | EventListenerObject
      | null,
    options?: AddEventListenerOptions | boolean
  ) => void;

  /** Dispatches a synthetic event event to target and returns true if either event's cancelable attribute value is false or its preventDefault() method was not invoked, and false otherwise. */
  declare dispatchEvent: (event: KeybindEvent<KeybindAction>) => boolean;

  /** Removes the event listener in target's event listener list with the same type, callback, and options. */
  declare removeEventListener: (
    type: KeybindAction,
    callback:
      | ((event: KeybindEvent<KeybindAction>) => void)
      | EventListenerObject
      | null,
    options?: EventListenerOptions | boolean
  ) => void;
}
