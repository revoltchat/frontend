import { Component, Show, splitProps } from "solid-js";
import { MessageProps } from "./Messages";

export const Info: Component<MessageProps> = (props) => {
  const [local] = splitProps(props, ['message', 'head']);

  const createdAt = new Date(local.message.createdAt).toLocaleTimeString().substring(0, 5);

  return (
    <time style={{ "font-size": "10px", color: "var(--tertiary-foreground)" }}>
      <Show when={local.head}>Today at {createdAt}</Show> {/* TODO: Harcoded string */}
      <Show when={local.message.edited}>&nbsp;(edited)</Show> {/* TODO: Harcoded string */}
    </time>
  );
}
