import {
  BiSolidPencil,
  BiSolidPlusCircle,
  BiSolidXCircle,
} from "solid-icons/bi";
import { BiRegularReset } from "solid-icons/bi";
import { For, Match, Switch } from "solid-js";

import { getController } from "@revolt/common";
import { useTranslation } from "@revolt/i18n";
import { KeybindAction } from "@revolt/keybinds";
import { state } from "@revolt/state";
import {
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

/**
 * Keybinds
 */
export default function Keybinds() {
  const t = useTranslation();

  const editKeybind = (action: KeybindAction, index: number) =>
    getController("modal").push({
      type: "edit_keybind",
      action,
      onSubmit: (sequence) => {
        state.keybinds.setKeybind(action, index, sequence);
      },
    });

  const addKeybind = (action: KeybindAction) =>
    getController("modal").push({
      type: "edit_keybind",
      action,
      onSubmit: (sequence) => {
        state.keybinds.addKeybind(action, sequence);
      },
    });

  const resetKeybind = (action: KeybindAction, index: number) =>
    state.keybinds.resetKeybindToDefault(action, index);

  // TODO: Tooltips for buttons
  // TODO: a11y pass
  // TODO: separate parts out
  return (
    <For each={Object.entries(categories)}>
      {([category, actions]) => (
        <CategoryCollapse
          title={t(`app.settings.pages.keybinds.category.${category}`)}
          open={true}
        >
          <Column group={true}>
            <For each={actions}>
              {(action) => (
                <ActionCategory>
                  <CategoryButton
                    description={t(
                      `app.settings.pages.keybinds.action.${action}.description`
                    )}
                    action={<BiSolidPlusCircle size={24} />}
                    onClick={() => addKeybind(action)}
                  >
                    {t(`app.settings.pages.keybinds.action.${action}.title`)}
                  </CategoryButton>
                  <For each={state.keybinds.getKeybinds()[action]}>
                    {(sequence, index) => {
                      const keybindIsDefault = state.keybinds.isDefaultKeybind(
                        action,
                        index()
                      );

                      const indexIsDefault = state.keybinds.isDefaultIndex(
                        action,
                        index()
                      );

                      return (
                        <CategoryButton
                          action={[
                            <IconButton
                              onClick={() => editKeybind(action, index())}
                            >
                              <BiSolidPencil size={24}></BiSolidPencil>
                            </IconButton>,
                            <Switch>
                              <Match when={!keybindIsDefault && indexIsDefault}>
                                <IconButton
                                  title={t(
                                    "app.settings.pages.keybinds.remove_keybind"
                                  )}
                                  onclick={() => resetKeybind(action, index())}
                                >
                                  <BiRegularReset size={24}></BiRegularReset>
                                </IconButton>
                              </Match>
                              <Match when={!keybindIsDefault}>
                                <IconButton
                                  title={t(
                                    "app.settings.pages.keybinds.remove_keybind"
                                  )}
                                  onclick={() => resetKeybind(action, index())}
                                >
                                  <BiSolidXCircle size={24}></BiSolidXCircle>
                                </IconButton>
                              </Match>
                            </Switch>,
                          ]}
                        >
                          <KeySequence sequence={sequence} short />
                        </CategoryButton>
                      );
                    }}
                  </For>
                </ActionCategory>
              )}
            </For>
          </Column>
        </CategoryCollapse>
      )}
    </For>
  );
}

// TODO: theming
const ActionCategory = styled("section", "ActionCategory")`
  display: grid;
  gap: 1px;

  > .CategoryButton .KeySequence {
    height: 2rem;
    padding-inline: 2px;
    width: 100%;
  }

  > .CategoryButton:first-child {
    border-start-start-radius: ${({ theme }) => theme?.borderRadius.md};
    border-start-end-radius: ${({ theme }) => theme?.borderRadius.md};
  }

  > .CategoryButton:not(:last-child) {
    border-end-end-radius: 0;
    border-end-start-radius: 0;
  }
`;
const KeybindEntry = styled("article", "KeybindEntry")`
  display: flex;
  gap: ${({ theme }) => theme?.gap.lg};

  padding: 10px 12px;

  .KeySequence {
    flex: 1;
  }
`;
