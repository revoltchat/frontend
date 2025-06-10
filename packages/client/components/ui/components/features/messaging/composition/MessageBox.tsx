import { BiRegularBlock } from "solid-icons/bi";
import { JSX, Match, Show, Switch, onMount } from "solid-js";

import { Trans } from "@lingui-solid/solid/macro";
import { cva } from "styled-system/css";
import { styled } from "styled-system/jsx";

import { typography } from "@revolt/ui/components/design";
import { Row } from "@revolt/ui/components/layout";

interface Props {
  /**
   * Ref to the input element
   */
  ref: HTMLTextAreaElement | undefined;

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
    height: "48px",
    flexShrink: 0,

    margin: "0 0 var(--gap-md) 0",
    borderRadius: "var(--borderRadius-lg)",

    display: "flex",
    background: "var(--colours-messaging-message-box-background)",
    color: "var(--colours-messaging-message-box-foreground)",
  },
});

/**
 * Input area
 */
const input = cva({
  base: {
    border: "none",
    resize: "none",
    outline: "none",
    background: "transparent",

    flexGrow: 1,
    padding: "14px 0",

    fontFamily: "var(--fonts-primary)",
    color: "var(--colours-messaging-message-box-foreground)",

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
          <textarea
            id="msgbox"
            class={input()}
            ref={props.ref}
            onInput={onInput}
            onKeyUp={onKeyUp}
            value={props.content}
            placeholder={props.placeholder}
            use:autoComplete={props.autoCompleteConfig ?? true}
          />
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
      <Show when={props.sendingAllowed}>{props.actionsEnd}</Show>
    </Base>
  );
}

MessageBox.InlineIcon = InlineIcon;
