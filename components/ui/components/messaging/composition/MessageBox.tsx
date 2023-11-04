import { BiRegularBlock } from "solid-icons/bi";
import { JSX, Match, Show, Switch } from "solid-js";
import { styled } from "solid-styled-components";

import { Client } from "revolt.js";

import { useTranslation } from "@revolt/i18n";

import { autoComplete } from "../../../directives";
import { generateTypographyCSS } from "../../design/atoms/display/Typography";
import { InlineIcon, Row } from "../../design/layout";

autoComplete;

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
  onKeyDown: (
    event: KeyboardEvent & { currentTarget: HTMLTextAreaElement }
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
}

/**
 * Message box container
 */
const Base = styled("div", "MessageBox")`
  height: 48px;
  flex-shrink: 0;

  margin: ${(props) => (props.theme!.gap.md + " ").repeat(3)}0;
  border-radius: ${(props) => props.theme!.borderRadius.lg};

  display: flex;
  background: ${({ theme }) =>
    theme!.colours["messaging-message-box-background"]};
  color: ${({ theme }) => theme!.colours["messaging-message-box-foreground"]};
`;

/**
 * Input area
 */
const Input = styled("textarea")`
  border: none;
  resize: none;
  outline: none;
  background: transparent;

  flex-grow: 1;
  padding: 14px 0;

  font-family: ${(props) => props.theme!.fonts.primary};
  color: ${({ theme }) => theme!.colours["messaging-message-box-foreground"]};
  ${(props) => generateTypographyCSS(props.theme!, "messages")}
`;

/**
 * Blocked message
 */
const Blocked = styled(Row)`
  font-size: 14px;
  flex-grow: 1;
  user-select: none;
  color: ${(props) => props.theme!.colours["foreground-300"]};
`;

/**
 * Message box
 */
export function MessageBox(props: Props) {
  const t = useTranslation();

  /**
   * Handle changes to input
   * @param event Event
   */
  function onInput(event: InputEvent & { currentTarget: HTMLTextAreaElement }) {
    props.setContent(event.currentTarget!.value);
  }

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
          <Input
            ref={props.ref}
            value={props.content}
            placeholder={props.placeholder}
            onInput={onInput}
            use:autoComplete={props.autoCompleteConfig ?? true}
          />
        }
      >
        <Match when={!props.sendingAllowed}>
          <Blocked align>{t("app.main.channel.misc.no_sending")}</Blocked>
        </Match>
      </Switch>
      <Show when={props.sendingAllowed}>{props.actionsEnd}</Show>
    </Base>
  );
}
