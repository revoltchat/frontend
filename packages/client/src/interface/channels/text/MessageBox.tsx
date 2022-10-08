import { styled } from "@revolt/ui";
import { Channel } from "revolt.js";
import { Accessor, createSignal } from "solid-js";

/**
 * Message box container
 */
const Base = styled("div")`
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

  font-family: ${({ theme }) => theme!.fonts.primary};
  color: ${({ theme }) => theme!.colours.foreground};
`;

/**
 * Action buttons
 */
const Button = styled("a")`
  //
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
export function MessageBox({ channel }: { channel: Accessor<Channel> }) {
  let input: HTMLTextAreaElement | undefined;
  const [value, setValue] = createSignal("");

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      event.preventDefault();
      input!.value = "";

      channel().sendMessage({ content: value() });
    }
  }

  return (
    <Base>
      <Spacer size="wide" />
      <Input
        ref={input}
        onKeyDown={onKeyDown}
        onInput={(e) => setValue(e.currentTarget.value)}
        placeholder={`Message ${channel().name}`}
      />
      <Spacer size="short" />
    </Base>
  );
}
