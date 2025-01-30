import {
  BiSolidPencil,
  BiSolidPlusCircle,
  BiSolidXCircle,
} from "solid-icons/bi";
import { BiRegularReset } from "solid-icons/bi";
import { For, Match, Switch, createMemo, createSignal } from "solid-js";

import { getController } from "@revolt/common";
import { useTranslation } from "@revolt/i18n";
import { KeybindAction } from "@revolt/keybinds";
import { KeyComboSequence } from "@revolt/keybinds";
import { KeyCombo } from "@revolt/keybinds";
import { state } from "@revolt/state";
import {
  Button,
  CategoryButton,
  CategoryCollapse,
  Column,
  Input,
  KeySequence,
} from "@revolt/ui";
import { styled } from "styled-system/jsx";

const categories: Record<string, KeybindAction[]> = {
  navigation: [
    KeybindAction.NavigateChannelUp,
    KeybindAction.NavigateChannelDown,
    KeybindAction.NavigateServerUp,
    KeybindAction.NavigateServerDown,
  ],
  messaging: [KeybindAction.MessagingEditPreviousMessage],
  // todo: advanced subsections?
  advanced: [
    // autocomplete
    KeybindAction.AutoCompleteSelect,
    KeybindAction.AutoCompleteUp,
    KeybindAction.AutoCompleteDown,

    // input / form
    KeybindAction.InputSubmit,
    KeybindAction.InputCancel,
    KeybindAction.InputForceSubmit,

    // messaging / channel
    KeybindAction.MessagingScrollToBottom,
    KeybindAction.MessagingMarkChannelRead,

    // probably won't be displayed unless under an advanced section.
    KeybindAction.NavigatePreviousContext,

    // development
    KeybindAction.DeveloperToggleAllExperiments,
  ],
};

/**
 * Keybinds
 */
export default function Keybinds() {
  const t = useTranslation();

  const translateCombo = (combo: KeyCombo, short: boolean) =>
    combo
      .map((key) =>
        t(`keys.${key}.${short ? "short" : "full"}` as any, {}, key)
      )
      .join("+");

  const translateSequence = (sequence: KeyComboSequence, short: boolean) =>
    sequence.map((combo) => translateCombo(combo, short)).join(" ");

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

  const searchData = createMemo(() =>
    Object.values(categories)
      .flat()
      .map((action) => [
        action,
        t(
          `app.settings.pages.keybinds.action.${action}.description` as any
        ) as string,
        t(
          `app.settings.pages.keybinds.action.${action}.title` as any
        ) as string,
        ...state.keybinds
          .getKeybinds()
          [action].flatMap((sequence) => [
            translateSequence(sequence, false),
            translateSequence(sequence, true),
          ]),
      ])
  );

  const [searchText, setSearchText] = createSignal("");

  const filteredData = createMemo(() => {
    const foundActions = searchData()
      .filter((data) =>
        data.some((text) =>
          text.toLocaleLowerCase().includes(searchText().toLocaleLowerCase())
        )
      )
      .map((data) => data[0]);

    // fromEntries is generally pretty slow, there may be a better way if search ever feels slow
    return Object.entries(categories).map(
      ([k, v]) => [k, v.filter((a) => foundActions.includes(a))] as const
    );
  });

  // TODO: Tooltips for buttons
  // TODO: a11y pass
  // TODO: separate parts out
  return (
    <Column>
      <Input
        type="text"
        onInput={(e) => setSearchText(e.target.value)}
        placeholder={t("app.settings.pages.keybinds.search")}
      />
      <For each={filteredData()}>
        {([category, actions]) => (
          <CategoryCollapse
            title={t(`app.settings.pages.keybinds.category.${category}` as any)}
            // TODO: open={category !== "advanced"}
          >
            <Column>
              <For each={actions}>
                {(action) => (
                  <ActionCategory>
                    <CategoryButton
                      description={t(
                        `app.settings.pages.keybinds.action.${action}.description` as any
                      )}
                      action={<BiSolidPlusCircle size={24} />}
                      onClick={() => addKeybind(action)}
                    >
                      {t(
                        `app.settings.pages.keybinds.action.${action}.title` as any
                      )}
                    </CategoryButton>
                    <For each={state.keybinds.getKeybinds()[action]}>
                      {(sequence, index) => {
                        const keybindIsDefault =
                          state.keybinds.isDefaultKeybind(action, index());

                        const indexIsDefault = state.keybinds.isDefaultIndex(
                          action,
                          index()
                        );

                        return (
                          <CategoryButton
                            action={[
                              <Button
                                size="fluid"
                                variant="plain"
                                onPress={() => editKeybind(action, index())}
                              >
                                <BiSolidPencil size={24} />
                              </Button>,
                              <Switch>
                                <Match
                                  when={!keybindIsDefault && indexIsDefault}
                                >
                                  <Button
                                    size="fluid"
                                    variant="plain"
                                    // title={t(
                                    //   "app.settings.pages.keybinds.remove_keybind"
                                    // )}
                                    onPress={() =>
                                      resetKeybind(action, index())
                                    }
                                  >
                                    <BiRegularReset size={24} />
                                  </Button>
                                </Match>
                                <Match when={!keybindIsDefault}>
                                  <Button
                                    size="fluid"
                                    variant="plain"
                                    // title={t(
                                    //   "app.settings.pages.keybinds.remove_keybind"
                                    // )}
                                    onPress={() =>
                                      resetKeybind(action, index())
                                    }
                                  >
                                    <BiSolidXCircle size={24} />
                                  </Button>
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
    </Column>
  );
}

// TODO: theming
const ActionCategory = styled("section", {
  base: {
    display: "grid",
    gap: "1px",
  },
  variants: {
    firstChild: {
      true: {
        borderStartStartRadius: "var(--borderRadius-md)",
        borderStartEndRadius: "var(--borderRadius-md)",
      },
    },
    notLastChild: {
      true: {
        borderEndEndRadius: 0,
        borderEndStartRadius: 0,
      },
    },
  },
});

const KeybindEntry = styled("article", {
  base: {
    display: "flex",
    gap: "var(--gap-lg)",
    padding: "10px 12px",
  },
  variants: {
    keySequence: {
      true: {
        flex: 1,
      },
    },
  },
});
