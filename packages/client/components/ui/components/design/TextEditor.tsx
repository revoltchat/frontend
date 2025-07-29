import { createEffect, createSignal, on } from "solid-js";
import { onCleanup } from "solid-js";

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
import { css } from "styled-system/css";

import { typography } from "./Text";

interface Props {
  placeholder?: string;
  initialValue?: string;
  onChange: (value: string) => void;

  _nonExhaustive?: null;
}

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

  const state = EditorState.create({
    schema,
    doc: defaultMarkdownParser.parse(props.initialValue ?? ""),
    plugins: [
      history(),
      keymap({
        Enter: () => {
          alert("hi");
          return true;
        },
        "Shift-Enter": baseKeymap["Enter"],
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

  return proseMirror;
}
