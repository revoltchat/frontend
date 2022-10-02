import { styled } from "solid-styled-components";
import Tooltip from "../../common/Tooltips";
import { dayjs } from "../../..";
import { Props } from "./Message";
import { decodeTime } from "ulid";
import { Show } from "solid-js";

export const DetailBase = styled.div`
    flex-shrink: 0;
    gap: 4px;
    font-size: 10px;
    display: inline-flex;
    color: ${({ theme }) => theme!.colours["foreground-400"]};
    .edited {
        cursor: default;
        &::selection {
            background-color: transparent;
            color: ${({ theme }) => theme!.colours["foreground-400"]};
        }
    }
`;

// TODO: 12/24 h format support
export function Info({ message, head }: Props) {
  if (head) {
    if (message.edited) {
      return (
        <DetailBase>
          <time class="copyTime">
            Today at {dayjs(decodeTime(message._id)).format("HH:mm")}
          </time>
          <Tooltip content={dayjs(message.edited).format("LLLL")}>
            <span class="edited">(edited)</span>
          </Tooltip>
        </DetailBase>
      );
    }

    return (
      <DetailBase>
        <time>
          Today at {dayjs(decodeTime(message._id)).format("HH:mm")}
        </time>
      </DetailBase>
    );
  }

  return (
    <DetailBase>
      <Show when={!message.edited}>
        <time>{dayjs(decodeTime(message._id)).format("HH:mm")}</time>
      </Show>
      <Show when={message.edited}>
        <Tooltip content={dayjs(message.edited).format("LLLL")}>
          <span class="edited">
            (edited)
          </span>
        </Tooltip>
      </Show>
    </DetailBase>
  );
};