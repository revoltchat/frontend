import { useFloating } from "solid-floating-ui";
import {
  Accessor,
  For,
  Match,
  Show,
  Switch,
  createEffect,
  createMemo,
  createSignal,
  on,
} from "solid-js";
import { onCleanup } from "solid-js";
import { Portal } from "solid-js/web";

import { autoUpdate, flip, shift } from "@floating-ui/dom";
import autocomplete, { ActionKind } from "prosemirror-autocomplete";
import { baseKeymap } from "prosemirror-commands";
import { toggleMark } from "prosemirror-commands";
import { history, redo, undo } from "prosemirror-history";
import { keymap } from "prosemirror-keymap";
import {
  defaultMarkdownParser,
  defaultMarkdownSerializer,
  schema,
} from "prosemirror-markdown";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Channel, ServerMember, ServerRole, User } from "revolt.js";
import { css, cva } from "styled-system/css";
import { styled } from "styled-system/jsx";

import { useClient } from "@revolt/client";
import { CustomEmoji, UnicodeEmoji } from "@revolt/markdown/emoji";

import emojiMapping from "../../emojiMapping.json";

import { typography } from "./Text";

const EMOJI_KEYS = Object.keys(emojiMapping).sort();
const MAPPED_EMOJI_KEYS = EMOJI_KEYS.map((id) => ({ id, name: id }));

interface Props {
  placeholder?: string;
  initialValue?: string;
  onChange: (value: string) => void;

  autoCompleteSearchSpace?: AutoCompleteSearchSpace;
}

export interface AutoCompleteSearchSpace {
  users?: User[];
  members?: ServerMember[];
  channels?: Channel[];
  roles?: ServerRole[];
}

interface AutoCompleteView {
  element: HTMLDivElement;
  // query: string;
  selected: number;
  result: {
    type: "emoji";
    matches: MatchEmoji[];
  };
}

type MatchEmoji =
  | {
      type: "unicode";
      codepoint: string;
      name: string;
    }
  | {
      type: "custom";
      id: string;
      name: string;
    };

/**
 * Rich text editor powered by ProseMirror
 */
export function TextEditor(props: Props) {
  const proseMirror = document.createElement("div");
  const placeholder = document.createElement("span");
  proseMirror.prepend(placeholder);

  const [value, setValue] = createSignal(props.initialValue ?? "");
  const [focused, setFocused] = createSignal(false);

  createEffect(() => (placeholder.innerText = props.placeholder ?? ""));

  createEffect(
    () =>
      (placeholder.style.display =
        value().length || focused() ? "none" : "block"),
  );

  proseMirror.className = css({
    flexGrow: 1,
    display: "flex",
    alignItems: "center",

    cursor: "text",

    "& > .ProseMirror": {
      width: "100%",
    },
  });

  placeholder.className = css({
    ...typography.raw({ class: "_messages" }),
    color: "var(--md-color-outline)",
    whiteSpace: "nowrap",
    userSelect: "none",
  });

  // initialise auto complete
  const client = useClient();
  const [autoComplete, setAutoComplete] = createSignal<AutoCompleteView>();

  const searchSpace = createMemo(() => {
    return {
      emoji: [MAPPED_EMOJI_KEYS, client().emojis.toList()].flat(),
    };
  });

  function updateAutoComplete(trigger: string, query?: string) {
    if (query) {
      // find the autocomplete element
      const element = document.getElementsByClassName(
        "autocomplete",
      )[0] as HTMLDivElement;

      if (!element) return setAutoComplete(undefined);

      // perform query
      const space = searchSpace();
      switch (trigger) {
        case "emoji": {
          const matches: MatchEmoji[] = [];
          const emoji = space.emoji.sort((a, b) =>
            a.name.localeCompare(b.name),
          );

          let i = 0;
          while (matches.length < 10 && i < emoji.length) {
            const name = emoji[i].name;
            if (name.includes(query)) {
              const id = emoji[i].id;
              matches.push(
                id.length === 26
                  ? {
                      type: "custom",
                      id,
                      name,
                    }
                  : {
                      type: "unicode",
                      codepoint: emojiMapping[id as keyof typeof emojiMapping],
                      name,
                    },
              );
            }

            i++;
          }

          if (matches.length === 0) break;

          const result: AutoCompleteView["result"] = {
            type: "emoji",
            matches,
          };

          setAutoComplete((ac) => ({
            element,
            // query,
            result,

            // ensure selected is within range
            selected: ac?.selected ? ac.selected % matches.length : 0,
          }));

          return;
        }
      }
    }

    setAutoComplete(undefined);
  }

  // eslint-disable-next-line solid/reactivity
  const autoCompletePlugin = props.autoCompleteSearchSpace
    ? autocomplete({
        triggers: [
          { name: "channel", trigger: "#" },
          { name: "mention", trigger: "@" },
          { name: "emoji", trigger: ":" },
        ],
        reducer(action) {
          const name = action.type?.name;
          switch (action.kind) {
            case ActionKind.open:
              updateAutoComplete(name!, action.filter);
              return true;
            case ActionKind.close:
              updateAutoComplete(name!);
              return false;
            case ActionKind.up:
              setAutoComplete((ac) =>
                ac
                  ? {
                      ...ac,
                      selected:
                        (ac.selected - 1 + ac.result.matches.length) %
                        ac.result.matches.length,
                    }
                  : undefined,
              );
              return true;
            case ActionKind.down:
              setAutoComplete((ac) =>
                ac
                  ? {
                      ...ac,
                      selected: (ac.selected + 1) % ac.result.matches.length,
                    }
                  : undefined,
              );
              return true;
            case ActionKind.enter: {
              const ac = autoComplete();
              switch (ac?.result?.type) {
                case "emoji": {
                  const match = ac.result.matches[ac.selected];

                  const tr = action.view.state.tr.deleteRange(
                    action.range.from,
                    action.range.to,
                  );

                  tr.insertText(
                    match.type === "unicode"
                      ? match.codepoint
                      : `:${match.id}:`,
                  );

                  // todo fork the library
                  // if (match.type == "unicode") {
                  // tr = tr.insertText(match.codepoint);
                  // } else {
                  //   tr = tr.insert(
                  //     0,
                  //     schema.nodes.custom_emoji.createAndFill({
                  //       id: match.id,
                  //     })!,
                  //   );
                  // }

                  action.view.dispatch(tr);

                  return true;
                }
              }

              return false;
            }
            default:
              updateAutoComplete(name!, action.filter);
              return false;
          }
        },
      })
    : [];

  // configure prosemirror
  const state = EditorState.create({
    schema,
    doc: defaultMarkdownParser.parse(props.initialValue ?? ""),
    plugins: [
      history(),
      keymap({
        "Shift-Enter": baseKeymap["Enter"],
      }),
      ...autoCompletePlugin,
      keymap({
        Enter: () => {
          // send message
          return true;
        },
        "Ctrl-b": toggleMark(schema.marks.strong),
        "Ctrl-i": toggleMark(schema.marks.em),
      }),
      keymap({ "Mod-z": undo, "Mod-y": redo }),
      keymap(baseKeymap),
    ],
  });

  const view = new EditorView(proseMirror, {
    state,
    handleTextInput(view) {
      const value = defaultMarkdownSerializer.serialize(view.state.doc);
      setValue(value);
      props.onChange?.(value);
    },
    handleDOMEvents: {
      focus: () => setFocused(true),
      blur: () => setFocused(false),
    },
    nodeViews: {},
  });

  createEffect(
    on(
      () => props.initialValue,
      (value) => {
        state.doc = defaultMarkdownParser.parse(value ?? "");
        view.updateState(state);
        setValue(value ?? "");
      },
      {
        defer: true,
      },
    ),
  );

  function onClick() {
    if (!focused()) {
      view.dom.focus();
    }
  }

  proseMirror.addEventListener("click", onClick);

  onCleanup(() => proseMirror.removeEventListener("click", onClick));

  return (
    <>
      {proseMirror}
      <Portal mount={document.getElementById("floating")!}>
        <Show when={autoComplete()}>
          <Suggestions state={autoComplete} />
        </Show>
      </Portal>
    </>
  );
}

function Suggestions(props: { state: Accessor<AutoCompleteView | undefined> }) {
  const element = () => props.state()!.element;
  const [floating, setFloating] = createSignal<HTMLDivElement>();

  const position = useFloating(element, floating, {
    placement: "top-start",
    middleware: [flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  return (
    <div
      class={base()}
      ref={setFloating}
      style={{
        position: position.strategy,
        top: `${position.y ?? 0}px`,
        left: `${position.x ?? 0}px`,
        "z-index": "999",
      }}
    >
      <Switch>
        <Match when={props.state()!.result.type === "emoji"}>
          <For each={props.state()!.result.matches}>
            {(match, idx) => (
              <Entry selected={props.state()!.selected === idx()}>
                <Switch
                  fallback={
                    <>
                      <UnicodeEmoji
                        emoji={(match as { codepoint: string }).codepoint}
                      />{" "}
                      <Name>:{match.name}:</Name>
                    </>
                  }
                >
                  <Match when={match.type === "custom"}>
                    <CustomEmoji id={(match as { id: string }).id} />{" "}
                    <Name>:{match.name}:</Name>
                  </Match>
                </Switch>
              </Entry>
            )}
          </For>
        </Match>
      </Switch>
    </div>
  );
}

/**
 * Individual auto complete entry
 */
const Entry = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",

    cursor: "pointer",
    gap: "var(--gap-md)",
    background: "transparent",
    padding: "var(--gap-sm) var(--gap-md)",
  },
  variants: {
    selected: {
      true: {
        background:
          "color-mix(in srgb, var(--md-sys-color-on-surface) 8%, transparent)",
      },
    },
  },
});

/**
 * Entry name
 */
const Name = styled("div", {
  base: {
    fontSize: "0.9em",
  },
});

/**
 * Auto complete container
 */
const base = cva({
  base: {
    display: "flex",
    flexDirection: "column",
    padding: "var(--gap-md) 0",
    overflow: "hidden",
    borderRadius: "var(--borderRadius-xs)",
    background: "var(--md-sys-color-surface-container)",
    color: "var(--md-sys-color-on-surface)",
    fill: "var(--md-sys-color-on-surface)",
    boxShadow: "0 0 3px var(--md-sys-color-shadow)",
  },
});
