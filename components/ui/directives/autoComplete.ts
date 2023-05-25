import { Accessor, JSX, createSignal, onCleanup } from "solid-js";

import emojiMapping from "../emojiMapping.json";

import { registerFloatingElement, unregisterFloatingElement } from "./floating";

const EMOJI_KEYS = Object.keys(emojiMapping).sort();

type Operator = "@" | ":" | "#";

export type AutoCompleteState =
  | {
      matched: "none";
    }
  | {
      matched: "emoji";
      length: number;
      matches: {
        type: "unicode";
        shortcode: string;
        codepoint: string;
        replacement: string;
      }[];
    };

/**
 * Configure auto complete for an input
 * @param element Input element
 * @param configuration Configuration
 */
export function autoComplete(
  element: HTMLInputElement,
  config: Accessor<JSX.Directives["autoComplete"]>
) {
  const [state, setState] = createSignal<AutoCompleteState>({
    matched: "none",
  });

  const [selection, setSelection] = createSignal(0);

  /**
   * Select a given auto complete entry
   * @param index Entry
   */
  function select(index: number) {
    const info = state() as AutoCompleteState & { matched: "emoji" };
    const currentPosition = element.selectionStart;
    if (!currentPosition) return;

    const match = info.matches[index];
    if (!match) return;

    const replacement = match.replacement;
    const originalValue = element.value;

    element.value =
      originalValue.slice(0, currentPosition - info.length) +
      replacement +
      originalValue.slice(currentPosition);

    const newPosition = currentPosition - info.length + replacement.length;
    element.setSelectionRange(newPosition, newPosition, "none");

    // Bubble up this change to the rest of the application,
    // we should do this directly through state in the future
    // but for now this will do.
    element.dispatchEvent(new Event("input", { bubbles: true }));
  }

  // TODO: use a virtual element on the caret
  // THIS IS NOT POSSIBLE WITH HTML INPUT ELEMENT!
  registerFloatingElement({
    element,
    config: {
      autoComplete: {
        state,
        selection,
        select,
      },
    },
    show: () => (state().matched === "none" ? undefined : "autoComplete"),
    hide: () => void 0,
  });

  /**
   * Intercept selection
   */
  function onKeyDown(
    event: KeyboardEvent & { currentTarget: HTMLTextAreaElement }
  ) {
    const current = state();
    if (current.matched !== "none") {
      if (event.key === "Enter") {
        event.preventDefault();
        select(selection());
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelection(
          (prev) => (prev === 0 ? current.matches.length : prev) - 1
        );
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelection(
          (prev) => (prev + 1 === current.matches.length ? -1 : prev) + 1
        );
        return;
      }
    }

    const value = config();
    if (typeof value === "object") {
      value.onKeyDown?.(event);
    }
  }

  /**
   * Update state as input changes
   */
  function onKeyUp(event: unknown) {
    if (event instanceof KeyboardEvent) {
      const current = state();
      if (current.matched !== "none") {
        if (["ArrowUp", "ArrowDown"].includes(event.key)) {
          return;
        }
      }
    }

    const cursor = element.selectionStart;
    if (cursor && cursor === element.selectionEnd) {
      const content = element.value.slice(0, cursor);

      // Try to figure out what we're matching
      const current = (["@", ":", "#"] as Operator[])
        // First find any applicable string
        .map((searchType) => {
          const index = content.lastIndexOf(searchType);
          return (
            index === -1
              ? undefined
              : [searchType, content.slice(index + 1).toLowerCase()]
          ) as [Operator, string];
        })
        // Filter by found strings
        .filter((match) => match)
        // Make sure there's no spaces nor other matching characters
        .filter(([, matchedString]) => /^[^\s@:#]*$/.test(matchedString))
        // Enforce minimum length for emoji matching
        .filter(([searchType, matchedString]) =>
          searchType === ":" ? matchedString.length > 0 : true
        )[0];

      if (current) {
        setSelection(0);
        setState(searchMatches(...current));
        return;
      }
    }

    if (state().matched !== "none")
      setState({
        matched: "none",
      });
  }

  /**
   * Hide if currently showing if input loses focus
   */
  function onBlur() {
    if (state().matched !== "none")
      setState({
        matched: "none",
      });
  }

  element.addEventListener("keydown", onKeyDown as never);
  element.addEventListener("keyup", onKeyUp);
  element.addEventListener("focus", onKeyUp);
  element.addEventListener("blur", onBlur);

  onCleanup(() => {
    unregisterFloatingElement(element);

    element.removeEventListener("keydown", onKeyDown as never);
    element.removeEventListener("keyup", onKeyUp);
    element.removeEventListener("focus", onKeyUp);
    element.removeEventListener("blur", onBlur);
  });
}

/**
 * Search for matches given operator and query
 */
function searchMatches(operator: Operator, query: string): AutoCompleteState {
  if (operator === ":") {
    const matches: string[] = [];

    let i = 0;
    while (matches.length < 10 && i < EMOJI_KEYS.length) {
      if (EMOJI_KEYS[i].includes(query)) {
        matches.push(EMOJI_KEYS[i]);
      }

      i++;
    }

    if (!matches.length) {
      return {
        matched: "none",
      };
    }

    return {
      matched: "emoji",
      length: query.length + 1,
      matches: matches.map((shortcode) => ({
        type: "unicode",
        shortcode,
        codepoint: emojiMapping[shortcode],
        replacement: emojiMapping[shortcode],
      })),
    };
  }

  return {
    matched: "none",
  };
}
