import type { Channel } from "revolt.js";
import {
  BiRegularBlock,
  BiRegularPlus,
  BiSolidFileGif,
  BiSolidHappyBeaming,
} from "solid-icons/bi";
import { styled } from "solid-styled-components";
import { Accessor, Match, Switch } from "solid-js";
import { useTranslation } from "@revolt/i18n";
import { Row } from "../../design/layout";
import { CompositionPicker } from "../../floating/CompositionPicker";

interface Props {
  channel: Channel;
  content: Accessor<string>;
  setContent: (v: string) => void;
}

/**
 * Message box container
 */
const Base = styled("div", "MessageBox")`
  height: 48px;
  flex-shrink: 0;

  display: flex;

  color: ${({ theme }) => theme!.colours["foreground-200"]};
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

  font-family: ${({ theme }) => theme!.fonts.primary};
  color: ${({ theme }) => theme!.colours.foreground};
`;

/**
 * Blocked message
 */
const Blocked = styled(Row)`
  flex-grow: 1;
  user-select: none;
`;

/**
 * Action buttons
 */
const Button = styled("a")`
  grid: 1/1;
  display: grid;
  cursor: pointer;
  place-self: normal;
  place-items: center;
`;

/**
 * Specific-width containers
 */
const Spacer = styled("div")<{ size: "short" | "normal" | "wide" }>`
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: ${({ size }) =>
    size === "wide" ? 62 : size === "normal" ? 42 : 14}px;
`;

/**
 * Message box
 */
export function MessageBox(props: Props) {
  let input: HTMLTextAreaElement | undefined;
  const t = useTranslation();

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter" && input) {
      event.preventDefault();
      props.channel.sendMessage({ content: input.value });
      props.setContent("");
      // input.value = "";
    }
  }

  function sendGIFMessage(content: string) {
    props.channel.sendMessage({ content });
  }

  return (
    <Base>
      <Switch fallback={<Spacer size="short" />}>
        <Match when={!props.channel.havePermission("SendMessage")}>
          <Spacer size="wide">
            <BiRegularBlock size={24} />
          </Spacer>
        </Match>
        <Match when={props.channel.havePermission("UploadFiles")}>
          <Spacer size="wide">
            <Button>
              <BiRegularPlus size={24} />
            </Button>
          </Spacer>
        </Match>
      </Switch>
      <Switch
        fallback={
          <Input
            ref={input}
            onKeyDown={onKeyDown}
            value={props.content()}
            placeholder={`Message ${props.channel.name}`}
            onInput={(e) => props.setContent(e.currentTarget.value)}
          />
        }
      >
        <Match when={!props.channel.havePermission("SendMessage")}>
          <Blocked align>{t("app.main.channel.misc.no_sending")}</Blocked>
        </Match>
      </Switch>
      <CompositionPicker initialState sendGIFMessage={sendGIFMessage}>
        {(triggerProps) => (
          <>
            <Spacer size="normal">
              <Button onClick={triggerProps.onClickGif}>
                <BiSolidFileGif size={24} />
              </Button>
            </Spacer>
            <Spacer size="normal">
              <Button
                ref={triggerProps.ref}
                onClick={triggerProps.onClickEmoji}
              >
                <BiSolidHappyBeaming size={24} />
              </Button>
            </Spacer>
          </>
        )}
      </CompositionPicker>
    </Base>
  );
}
