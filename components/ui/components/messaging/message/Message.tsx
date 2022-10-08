import { Message as MessageInterface } from "revolt.js";
import { MessageContainer } from "./Container";

export function Message({
  message,
  tail,
}: {
  message: MessageInterface;
  tail?: boolean;
}) {
  return (
    <MessageContainer
      username={message.author?.username}
      avatar={
        message.author?.generateAvatarURL({ max_side: 256 }) ??
        message.author?.defaultAvatarURL
      }
      colour={message.member?.roleColour}
      timestamp={message.createdAt}
      edited={message.edited}
      tail={tail}
    >
      {message.content}
    </MessageContainer>
  );
}
