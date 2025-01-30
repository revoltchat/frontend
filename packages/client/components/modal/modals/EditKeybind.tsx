import { BiRegularReset } from "solid-icons/bi";
import { createSignal, onMount } from "solid-js";

import { useTranslation } from "@revolt/i18n";
import {
  KEYBINDING_MODIFIER_KEYS,
  KeyComboSequence as TKeySequence,
} from "@revolt/keybinds";
import { Button, KeySequence } from "@revolt/ui";

import { PropGenerator } from "../types";
import { styled } from "styled-system/jsx";

const Container = styled("div", {
  base: {
    display: "flex",
    gap: "1ch",
    placeItems: "center",
  },
});

const KeybindInput = styled("output", {
  base: {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    fontSize: "0.875rem",
    minWidth: 0,
    flexGrow: 1,
    padding: "8px",
    fontFamily: "var(--fonts-monospace)",
    borderRadius: "var(--borderRadius-md)",
    background: "var(--unset-bg)",
    height: "4ch",
    "& kbd": {
      flexWrap: "wrap",
    },
  },
});

const REPLACEMENTS: Record<string, string> = {
  " ": "Space",
};

// TODO: maybe add warning if the user doesn't have a modifier included?
export const EditKeybind: PropGenerator<"edit_keybind"> = (props) => {
  const t = useTranslation();

  const [sequence, setSequence] = createSignal<TKeySequence>([]);
  // temporary state for modifier keys to live in so it still feels resposive when making combos
  const [mods, setMods] = createSignal<string[]>([]);
  let okButton: HTMLButtonElement;
  let input: HTMLOutputElement | undefined;
  // TODO: use DOM types instead
  let timer: NodeJS.Timeout;

  const submit = () => {
    // TODO: warning about this instead of silently failing
    if (sequence().length > 0) {
      props.onSubmit(sequence());
    }
  };

  const focusSubmit = () => {
    clearTimeout(timer);
    okButton!.focus();
  };

  const reset = () => {
    setSequence([]);
    setMods([]);
    input?.focus();
  };

  function onKeyDown(event: KeyboardEvent) {
    event.stopImmediatePropagation();
    event.preventDefault();

    if (event.repeat) return;
    timer && clearTimeout(timer);

    const mods = KEYBINDING_MODIFIER_KEYS.filter((mod) =>
      event.getModifierState(mod)
    );

    if (KEYBINDING_MODIFIER_KEYS.includes(event.key)) {
      setMods(mods);
    } else {
      setMods([]);
      setSequence((seq) => [
        ...seq,
        [...mods, REPLACEMENTS[event.key] ?? event.key],
      ]);
      if (sequence().length >= 1) {
        focusSubmit();
      }
    }
  }

  function onKeyUp(event: KeyboardEvent) {
    event.stopImmediatePropagation();
    event.preventDefault();

    // Allow the user to use keyboard navigation again.
    if (mods.length === 0) {
      timer = setTimeout(() => {
        focusSubmit();
      }, 1000);
    }

    if (mods.length > 0 && KEYBINDING_MODIFIER_KEYS.includes(event.key)) {
      setSequence((seq) => [...seq, mods()]);
      setMods([]);
      if (sequence().length >= 1) {
        focusSubmit();
      }
    }
  }

  onMount(() => {
    input?.focus();
  });

  return {
    // TODO: the way this reads and looks is awkward, find a better way
    title: t("app.special.modals.edit_keybind.title", {
      action: t(
        `app.settings.pages.keybinds.action.${props.action}.title` as any
      ),
    }),
    actions: [
      {
        ref: (el: any) => (okButton = el),
        onClick: () => {
          submit();
          return true;
        },
        confirmation: true,
        children: t("app.special.modals.actions.ok"),
      },
      {
        onClick: () => true,
        confirmation: false,
        children: t("app.special.modals.actions.cancel"),
      },
    ],
    children: (
      <Container>
        <KeybindInput
          tabIndex={0}
          ref={input!}
          onFocus={reset}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
        >
          {<KeySequence sequence={[mods()].concat(sequence())} short />}
        </KeybindInput>
        <Button
          // title="clear input"
          onPress={reset}
        >
          <BiRegularReset size={20}></BiRegularReset>
        </Button>
      </Container>
    ),
  };
};

export default EditKeybind;
