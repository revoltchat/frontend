import { BiSolidPencil, BiSolidPlusCircle } from "solid-icons/bi";
import { BiRegularReset } from "solid-icons/bi";
import { Component, For, Show } from "solid-js";

import { useTranslation } from "@revolt/i18n";
import { KeybindAction } from "@revolt/keybinds";
import { state } from "@revolt/state";
import {
  Button,
  CategoryButton,
  CategoryCollapse,
  Column,
  IconButton,
  KeySequence,
  styled,
} from "@revolt/ui";

const categories: Record<string, KeybindAction[]> = {
  navigation: [
    KeybindAction.NavigateChannelUp,
    KeybindAction.NavigateChannelDown,
    KeybindAction.NavigateServerUp,
    KeybindAction.NavigateServerDown,
  ],
};

const ActionSection = styled("details")``;

// const KeybindEntries: Component = () => {};

/**
 * Keybinds
 */
export default function Keybinds() {
  const t = useTranslation();

  // TODO: Tooltips for buttons
  // TODO: a11y pass
  return (
    <For each={Object.entries(categories)}>
      {([category, actions]) => (
        <CategoryCollapse title={category} open={true}>
          <Column group={true}>
            <For each={actions}>
              {(action) => (
                <>
                  <CategoryButton
                    description={action}
                    action={<BiSolidPlusCircle size={24} />}
                  >
                    {action}
                  </CategoryButton>
                  <For each={state.keybinds.getKeybinds()[action]}>
                    {(sequence, i) => {
                      const keybindIsDefault = state.keybinds.isDefaultKeybind(
                        action,
                        i()
                      );

                      return (
                        <KeybindEntry>
                          <KeySequence sequence={sequence} short />
                          <IconButton>
                            <BiSolidPencil size={24}></BiSolidPencil>
                          </IconButton>
                          <Show when={!keybindIsDefault}>
                            <IconButton>
                              <BiRegularReset size={24}></BiRegularReset>
                            </IconButton>
                          </Show>
                        </KeybindEntry>
                      );
                    }}
                  </For>
                </>
              )}
            </For>
          </Column>
        </CategoryCollapse>
      )}
    </For>
  );
}

const KeybindEntry = styled("article", "KeybindEntry")`
  display: flex;
  gap: ${({ theme }) => theme?.gap.lg};

  padding: 10px 12px;

  .KeySequence {
    flex: 1;
  }
`;
