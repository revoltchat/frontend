import { styled } from "solid-styled-components";

import { Message as MessageInterface } from "revolt.js";

export const ReplyHelperComponent = styled("span")`
  opacity: 0;
  pointer-events: auto;
  z-index: -1;
  height: 0;
  margin: 0 -3px;
  display: block;
`;

/**
 * Helper component to copy the reply by using invisible text
 * @param props
 */
export function MessageReplyCopyHelper(props: { message: MessageInterface }) {
  // make the element invisible but selectable
  return (
    <ReplyHelperComponent>
      Replying to {props.message.username}: {props.message.content}
    </ReplyHelperComponent>
  );
}
