import { BiRegularBlock } from "solid-icons/bi";
import { JSX, Match, Show, Switch, onMount } from "solid-js";

import { Trans } from "@lingui-solid/solid/macro";
import { cva } from "styled-system/css";
import { styled } from "styled-system/jsx";

import { Row, TextEditor, typography } from "@revolt/ui";

interface Props {
  /**
   * Ref to the input element
   */
  ref: HTMLTextAreaElement | undefined;

  /**
   * Initial content
   */
  initialValue: string;

  /**
   * Text content
   */
  content: string;

  /**
   * Handle key presses
   */
  onKeyDown?: (
    event: KeyboardEvent & { currentTarget: HTMLTextAreaElement },
  ) => void;

  /**
   * Update text content
   * @param v New content
   */
  setContent: (v: string) => void;

  /**
   * Actions to the left of the message box
   */
  actionsStart: JSX.Element;

  /**
   * Actions to the right of the message box
   */
  actionsEnd: JSX.Element;

  /**
   * Placeholder in message box
   */
  placeholder: string;

  /**
   * Whether sending messages is allowed
   */
  sendingAllowed: boolean;

  /**
   * Auto complete config
   */
  autoCompleteConfig?: JSX.Directives["autoComplete"];

  /**
   * Update the current draft selection
   */
  updateDraftSelection?: (start: number, end: number) => void;
}

/**
 * Message box container
 */
const Base = styled("div", {
  base: {
    flexGrow: 1,
    flexShrink: 0,

    paddingInlineEnd: "var(--gap-md)",
    margin: "0 0 var(--gap-md) 0",
    borderRadius: "var(--borderRadius-xl)",

    display: "flex",
    background: "var(--md-sys-color-primary-container)",
    color: "var(--md-sys-color-on-primary-container)",
  },
});

const InputArea = styled("div", {
  base: {
    flexGrow: 1,
    marginBlock: "8px",
    borderRadius: "var(--borderRadius-full)",
    background: "var(--md-sys-color-surface)",

    display: "flex",
    gap: "var(--gap-sm)",
  },
});

/**
 * Input area
 */
const input = cva({
  base: {
    flexGrow: 1,

    border: "none",
    resize: "none",
    outline: "none",
    paddingInline: "14px",

    background: "transparent",
    color: "var(--md-sys-color-on-surface)",

    fontFamily: "var(--fonts-primary)",
    ...typography.raw({ class: "_messages" }),
  },
});

/**
 * Blocked message
 */
const Blocked = styled(Row, {
  base: {
    fontSize: "14px",
    flexGrow: 1,
    userSelect: "none",
  },
});

/**
 * Specific-width icon container
 */
export const InlineIcon = styled("div", {
  base: {
    display: "grid",
    flexShrink: 0,
    placeItems: "center",
  },
  variants: {
    size: {
      short: {
        width: "14px",
      },
      normal: {
        width: "42px",
      },
      wide: {
        width: "62px",
      },
    },
  },
});

/**
 * Message box
 */
export function MessageBox(props: Props) {
  /**
   * Handle changes to input
   * @param event Event
   */
  function onInput(event: InputEvent & { currentTarget: HTMLTextAreaElement }) {
    props.setContent(event.currentTarget!.value);
  }

  /**
   * Handle key up event
   * @param event Event
   */
  function onKeyUp(
    event: KeyboardEvent & {
      currentTarget: HTMLTextAreaElement;
    },
  ) {
    props.updateDraftSelection?.(
      event.currentTarget.selectionStart,
      event.currentTarget.selectionEnd,
    );
  }

  /**
   * Set initial draft selection
   */
  onMount(() =>
    props.updateDraftSelection?.(props.content.length, props.content.length),
  );

  return (
    <Base>
      <Switch fallback={props.actionsStart}>
        <Match when={!props.sendingAllowed}>
          <InlineIcon size="wide">
            <Blocked>
              <BiRegularBlock size={24} />
            </Blocked>
          </InlineIcon>
        </Match>
      </Switch>
      <Switch
        fallback={
          // https://github.com/curvenote/editor/tree/main/packages/prosemirror-autocomplete
          // https://github.com/curvenote/editor/tree/main/packages/prosemirror-codemark
          <>
            <TextEditor
              placeholder={props.placeholder}
              initialValue={props.initialValue}
              onChange={props.setContent}
            />
            <Show when={props.sendingAllowed}>{props.actionsEnd}</Show>
          </>
          // <InputArea>
          //   <textarea
          //     id="msgbox"
          //     class={input()}
          //     ref={props.ref}
          //     onInput={onInput}
          //     onKeyUp={onKeyUp}
          //     value={props.content}
          //     placeholder={props.placeholder}
          //     use:autoComplete={props.autoCompleteConfig ?? true}
          //   />
          // </InputArea>
        }
      >
        <Match when={!props.sendingAllowed}>
          <Blocked align>
            <Trans>
              You don't have permission to send messages in this channel.
            </Trans>
          </Blocked>
        </Match>
      </Switch>
    </Base>
  );
}

MessageBox.InlineIcon = InlineIcon;
