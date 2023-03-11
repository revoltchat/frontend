import { BiSolidBolt } from "solid-icons/bi";
import type { JSX } from "solid-js";
import { styled } from "solid-styled-components";

const Base = styled("div")`
  gap: 2px;
  display: flex;
  padding: 1px 5px;
  user-select: none;
  position: relative;
  width: fit-content;

  align-items: center;
  font-weight: 800;
  font-style: italic;
  font-size: 0.8125rem;
  text-transform: uppercase;

  background: ${({ theme }) => theme!.colours.accent};
  color: var(--accent-foreground); /* TODO */

  border-radius: ${({ theme }) => theme!.borderRadius.md};
  border-start-start-radius: 0 !important;

  &::before {
    content: "";
    position: absolute;

    top: 0;
    right: -4px;
    left: -4px;
    width: 2px;
    height: 4px;
    display: flex;

    border: 8px solid ${({ theme }) => theme!.colours.accent};
    border-right: 5px solid transparent;
    border-left: 5px solid transparent;
    border-bottom: 5px solid transparent;
  }
`;

/**
 * Concept icon
 */
export function Turbo(props: { children: JSX.Element }) {
  return (
    <Base>
      <BiSolidBolt size={13} /> {props.children}
    </Base>
  );
}
