import type { Channel } from "revolt.js";
import { BiRegularBlock, BiRegularPlus } from "solid-icons/bi";
import { styled } from "solid-styled-components";
import { Accessor, Match, Setter, Show, Switch } from "solid-js";
import { useTranslation } from "@revolt/i18n";
import { Row } from "../../design/layout";

interface Props {
  ref: HTMLTextAreaElement | undefined;
  channel: Channel;
  content: Accessor<string>;
  sendMessage: () => void;
  setContent: (v: string) => void;
  addFile: () => void;
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
  const t = useTranslation();

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter" && props.ref) {
      event.preventDefault();
      props.sendMessage();
    }
  }

  return (
    <Base>
      <Spacer size="wide">
        <Switch>
          <Match when={!props.channel.havePermission("SendMessage")}>
            <BiRegularBlock size={24} />
          </Match>
          <Match when={props.channel.havePermission("UploadFiles")}>
            <Button onClick={props.addFile}>
              <BiRegularPlus size={24} />
            </Button>
          </Match>
        </Switch>
      </Spacer>
      <Switch
        fallback={
          <Input
            ref={props.ref}
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
      <Spacer size="short" />
    </Base>
  );
}
