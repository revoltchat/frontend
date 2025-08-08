import { BiRegularBlock } from "solid-icons/bi";
import { JSX, Match, Show, Switch, onMount } from "solid-js";

import { Trans } from "@lingui-solid/solid/macro";
import { styled } from "styled-system/jsx";

import { Row, TextEditor } from "@revolt/ui";
import { AutoCompleteSearchSpace } from "@revolt/ui/components/design/TextEditor";

interface Props {
  /**
   * Ref to the input element
   */
  ref: HTMLTextAreaElement | undefined;

  /**
   * Initial content
   */
  initialValue: readonly [string];

  /**
   * Text content
   */
  content: string;

  /**
   * Handle event to send message
   */
  onSendMessage: () => void;

  /**
   * Handle event when user is typing
   */
  onTyping: () => void;

  /**
   * Handle event when user wants to edit the last message in chat
   */
  onEditLastMessage: () => void;

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
  autoCompleteSearchSpace?: AutoCompleteSearchSpace;

  /**
   * Update the current draft selection
   *
   * @deprecated have to hook into ProseMirror instance now!
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
  // props.updateDraftSelection?.(
  //   event.currentTarget.selectionStart,
  //   event.currentTarget.selectionEnd,
  // );

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
          <>
            <TextEditor
              placeholder={props.placeholder}
              initialValue={props.initialValue}
              onChange={props.setContent}
              onComplete={props.onSendMessage}
              onTyping={props.onTyping}
              onPreviousContext={props.onEditLastMessage}
              autoCompleteSearchSpace={props.autoCompleteSearchSpace}
            />
            <Show when={props.sendingAllowed}>{props.actionsEnd}</Show>
          </>
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
