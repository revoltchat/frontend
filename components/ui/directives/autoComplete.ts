import { createSignal, onCleanup } from "solid-js";

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
      matches: {
        type: "unicode";
        shortcode: string;
        codepoint: string;
      }[];
    };

/**
 * Configure auto complete for an input
 * @param element Input element
 */
export function autoComplete(element: HTMLInputElement) {
  const [state, setState] = createSignal<AutoCompleteState>({
    matched: "none",
  });

  // TODO: use a virtual element on the caret
  // THIS IS NOT POSSIBLE WITH HTML INPUT ELEMENT!
  registerFloatingElement({
    element,
    config: {
      autoComplete: state,
    },
    show: () => (state().matched === "none" ? undefined : "autoComplete"),
    hide: () => void 0,
  });

  /**
   * Intercept selection
   */
  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      event.preventDefault();
    }

    // compute changes
    // console.info(element.value);
  }

  /**
   * Update state as input changes
   */
  function onKeyUp() {
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
        setState(searchMatches(...current));
        return;
      }
    }

    if (state().matched !== "none")
      setState({
        matched: "none",
      });
  }

  element.addEventListener("keydown", onKeyDown);
  element.addEventListener("keyup", onKeyUp);

  onCleanup(() => {
    unregisterFloatingElement(element);

    element.addEventListener("keydown", onKeyDown);
    element.addEventListener("keyup", onKeyUp);
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

    return {
      matched: "emoji",
      matches: matches.map((shortcode) => ({
        type: "unicode",
        shortcode,
        codepoint: emojiMapping[shortcode],
      })),
    };
  }

  return {
    matched: "none",
  };
}
