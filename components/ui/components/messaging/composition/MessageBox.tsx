import {
  BiRegularBlock,
  BiRegularHappyBeaming,
  BiRegularPlus,
  BiSolidFileGif,
  BiSolidHappyBeaming,
  BiSolidSend,
} from "solid-icons/bi";
import { Accessor, Match, Switch } from "solid-js";
import { styled } from "solid-styled-components";

import type { Channel } from "revolt.js";

import { useTranslation } from "@revolt/i18n";

import { IconButton } from "../../design";
import { generateTypographyCSS } from "../../design/atoms/display/Typography";
import { InlineIcon, Row } from "../../design/layout";

interface Props {
  /**
   * Ref to the input element
   */
  ref: HTMLTextAreaElement | undefined;

  /**
   * Current channel
   */
  channel: Channel;

  /**
   * Text content
   */
  content: Accessor<string>;

  /**
   * Handle message send
   */
  sendMessage: () => void;

  /**
   * Update text content
   * @param v New content
   */
  setContent: (v: string) => void;

  /**
   * Trigger new file button
   */
  addFile: () => void;

  /**
   * Are file uploads enabled?
   */
  __tempAllowFileUploads: () => boolean;
}

/**
 * Message box container
 */
const Base = styled("div", "MessageBox")`
  height: 48px;
  flex-shrink: 0;

  display: flex;
  background: ${({ theme }) => theme!.colours["background-300"]};
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
  color: ${(props) => props.theme!.colours.foreground};
  ${(props) => generateTypographyCSS(props.theme!, "messages")}
`;

/**
 * Blocked message
 */
const Blocked = styled(Row)`
  flex-grow: 1;
  user-select: none;
`;

/**
 * Message box
 */
export function MessageBox(props: Props) {
  const t = useTranslation();

  /**
   * Handle key presses in input box
   * @param event Keyboard Event
   */
  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter" && props.ref) {
      event.preventDefault();
      props.sendMessage();
    }
  }

  return (
    <Base>
      <Switch fallback={<InlineIcon size="short" />}>
        <Match when={!props.channel.havePermission("SendMessage")}>
          <InlineIcon size="wide">
            <BiRegularBlock size={24} />
          </InlineIcon>
        </Match>
        {props.__tempAllowFileUploads() ? "y" : "n"}
        <Match
          when={
            props.channel.havePermission("UploadFiles") &&
            props.__tempAllowFileUploads()
          }
        >
          <InlineIcon size="wide">
            <IconButton onClick={props.addFile}>
              <BiRegularPlus size={24} />
            </IconButton>
          </InlineIcon>
        </Match>
      </Switch>
      <Switch
        fallback={
          <Input
            ref={props.ref}
            onKeyDown={onKeyDown}
            value={props.content()}
            placeholder={
              props.channel.channel_type === "SavedMessages"
                ? "Send to notes"
                : `Message ${
                    props.channel.name ?? props.channel.recipient?.username
                  }`
            }
            onInput={(e) => props.setContent(e.currentTarget.value)}
          />
        }
      >
        <Match when={!props.channel.havePermission("SendMessage")}>
          <Blocked align>{t("app.main.channel.misc.no_sending")}</Blocked>
        </Match>
      </Switch>
      <InlineIcon size="normal">
        <IconButton>
          <BiSolidFileGif size={24} />
        </IconButton>
      </InlineIcon>
      <InlineIcon size="normal">
        <IconButton>
          <BiSolidHappyBeaming size={24} />
        </IconButton>
      </InlineIcon>
      <InlineIcon size="normal">
        <IconButton>
          <BiSolidSend size={24} onClick={props.sendMessage} />
        </IconButton>
      </InlineIcon>
    </Base>
  );
}
