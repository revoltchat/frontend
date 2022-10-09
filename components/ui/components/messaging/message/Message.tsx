import { Message as MessageInterface } from "revolt.js";
import { MessageContainer } from "./Container";

/**
 * Render a Message with or without a tail
 */
export function Message({
  message,
  tail,
}: {
  message: MessageInterface;
  tail?: boolean;
}) {
  return (
    <MessageContainer
      username={message.username}
      avatar={message.avatarURL}
      colour={message.roleColour}
      timestamp={message.createdAt}
      edited={message.edited}
      tail={tail}
    >
      {message.content}
    </MessageContainer>
  );
}
