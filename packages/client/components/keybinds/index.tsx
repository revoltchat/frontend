import {
  JSXElement,
  createContext,
  createEffect,
  on,
  onCleanup,
  useContext,
} from "solid-js";

import { ReactiveSet } from "@solid-primitives/set";

export enum KeybindAction {
  /**
   * Navigate to channel above current channel
   */
  NAVIGATION_CHANNEL_UP = "navigation_channel_up",

  /**
   * Navigate to channel below current channel
   */
  NAVIGATION_CHANNEL_DOWN = "navigation_channel_down",

  /**
   * Mark channel as read and jump to the end of conversation
   */
  CHAT_JUMP_END = "chat_jump_end",

  /**
   * Close the currently active modal
   */
  CLOSE_MODAL = "close_modal",

  /**
   * Close the currently floating element
   */
  CLOSE_FLOATING = "close_floating",
}

/**
 * Sequences are a set of keys that must be pressed at the same time
 */
const DEFAULT_SEQUENCES: Record<KeybindAction, string[]> = {
  [KeybindAction.NAVIGATION_CHANNEL_UP]: ["Alt", "ArrowDown"],
  [KeybindAction.NAVIGATION_CHANNEL_DOWN]: ["Alt", "ArrowDown"],
  [KeybindAction.CHAT_JUMP_END]: ["Escape"],
  [KeybindAction.CLOSE_MODAL]: ["Escape"],
  [KeybindAction.CLOSE_FLOATING]: ["Escape"],
};

/**
 * Sequences are a set of keys that must be pressed at the same time
 * (macOS version)
 */
const DEFAULT_MAC_SEQUENCES: Record<KeybindAction, string[]> = {
  [KeybindAction.NAVIGATION_CHANNEL_UP]: ["Alt" /* Command */, "ArrowUp"],
  [KeybindAction.NAVIGATION_CHANNEL_DOWN]: ["Alt" /* Command */, "ArrowDown"],
  [KeybindAction.CHAT_JUMP_END]: ["Escape"],
  [KeybindAction.CLOSE_MODAL]: ["Escape"],
  [KeybindAction.CLOSE_FLOATING]: ["Escape"],
};

/**
 * Priority of actions relative to each other
 */
const ACTION_PRIORITY: KeybindAction[] = [
  // 'Escape' bindings
  KeybindAction.CLOSE_FLOATING,
  KeybindAction.CLOSE_MODAL,
  KeybindAction.CHAT_JUMP_END,

  // Navigation conflicts
  KeybindAction.NAVIGATION_CHANNEL_UP,
  KeybindAction.NAVIGATION_CHANNEL_DOWN,
];

type KeybindContext = {
  createKeybind: (keybind: KeybindAction, callback: () => void) => void;
};

const keybindContext = createContext<KeybindContext>(null! as KeybindContext);

export function KeybindContext(props: { children: JSXElement }) {
  /**
   * Keep track of pressed keys to match sequences
   */
  const activeKeys = new ReactiveSet<string>();

  // TODO: clear on successful match

  /**
   * Keep track of which keybinds are currently bound
   * to filter the firing keybindings list
   */
  const currentlyBound = ACTION_PRIORITY.reduce(
    (d, k) => ({ ...d, [k]: 0 }),
    {} as Record<KeybindAction, number>,
  );

  /**
   * Sequences for use
   */
  const sequences = navigator.platform.startsWith("Mac")
    ? DEFAULT_MAC_SEQUENCES
    : DEFAULT_SEQUENCES;

  /**
   * Get the currently firing keybind
   */
  function firing() {
    return (
      ACTION_PRIORITY
        // filter to those keybinds that are bound
        .filter((keybind) => currentlyBound[keybind])
        // check whether the keybind is being pressed
        .filter((keybind) =>
          sequences[keybind].every((key) => activeKeys.has(key)),
        )
        // return the highest priority keybind
        .shift()
    );
  }

  /**
   * Debug currently pressed sequences
   */
  if (import.meta.env.DEV) {
    createEffect(() =>
      console.debug(
        "[keybinds] Currently pressing",
        [...activeKeys],
        "which selects",
        ACTION_PRIORITY
          // filter to those keybinds that are bound
          .filter((keybind) => currentlyBound[keybind])
          // check whether the keybind is being pressed
          .reduce(
            (d, keybind) => ({
              ...d,
              [keybind]: sequences[keybind].every((key) => activeKeys.has(key)),
            }),
            {},
          ),
      ),
    );
  }

  /**
   * Check whether a given keybind fired
   * @param keybind Keybind
   */
  function isFired(keybind: KeybindAction) {
    return firing() === keybind;
  }

  /**
   * Handle key down event by adding it to active keys
   */
  function onKeyDown(event: KeyboardEvent) {
    activeKeys.add(event.key);
  }

  /**
   * Handle key up event by removing it from active keys
   */
  function onKeyUp(event: KeyboardEvent) {
    activeKeys.delete(event.key);
  }

  document.body.addEventListener("keydown", onKeyDown);
  document.body.addEventListener("keyup", onKeyUp);

  onCleanup(() => {
    document.body.removeEventListener("keydown", onKeyDown);
    document.body.removeEventListener("keyup", onKeyUp);
  });

  return (
    <keybindContext.Provider
      value={{
        createKeybind(keybind, callback) {
          currentlyBound[keybind]++;
          onCleanup(() => currentlyBound[keybind]--);

          createEffect(
            on(
              () => isFired(keybind),
              (fired) => fired && callback(),
            ),
          );
        },
      }}
    >
      {props.children}
    </keybindContext.Provider>
  );
}

/**
 * Wrapper for contextual createKeybind function
 * @param keybind Keybind
 * @param callback Callback
 */
export function createKeybind(keybind: KeybindAction, callback: () => void) {
  const { createKeybind } = useContext(keybindContext);
  createKeybind(keybind, callback);
}

/**
 * Declarative keybind component
 */
export function Keybind(props: {
  keybind: KeybindAction;
  onPressed: () => void;
}) {
  createKeybind(props.keybind, props.onPressed);
  return null;
}
