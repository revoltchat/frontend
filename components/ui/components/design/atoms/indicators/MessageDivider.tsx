import { Show } from "solid-js";
import { styled } from "solid-styled-components";

/**
 * Divider line
 */
const Base = styled("div")<{ unread?: boolean }>`
  height: 0;
  display: flex;
  user-select: none;
  align-items: center;
  margin: 17px 12px 5px;

  time {
    margin-top: -2px;
    font-size: 0.6875rem;
    line-height: 0.6875rem;
    font-weight: 600;
    padding-inline: 5px 5px;

    color: ${({ theme }) => theme!.colours["foreground-400"]};
    background: ${({ theme }) => theme!.colours["background-200"]};
  }

  border-top: thin solid
    ${({ unread, theme }) =>
      theme!.colours[unread ? "accent" : "foreground-400"]};
`;

/**
 * Unread indicator
 */
const Unread = styled("div")`
  font-size: 0.625rem;
  font-weight: 600;
  background: ${({ theme }) => theme!.colours.accent};
  color: var(--accent-contrast); /* TODO */

  padding: 2px 6px;
  margin-top: -1px;
  border-radius: 60px;
`;

interface Props {
  /**
   * Display the date
   */
  date?: string;

  /**
   * Show unread indicator
   */
  unread?: boolean;
}

/**
 * Generic message divider
 */
export function MessageDivider(props: Props) {
  return (
    <Base unread={props.unread}>
      <Show when={props.unread}>
        <Unread>NEW</Unread>
      </Show>
      <Show when={props.date}>
        <time>{props.date}</time>
      </Show>
    </Base>
  );
}
