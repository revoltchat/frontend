import { JSX } from "solid-js";
import { styled } from "solid-styled-components";

interface Props {
  children?: JSX.Element;
}

const Base = styled.div`
  font-size: 0.8em;
  font-weight: 600;
  padding: 0.2em 0.4em;
  display: inline-block;
  text-transform: uppercase;
  color: ${(props) => props.theme!.colours.foreground};
  background: ${(props) => props.theme!.colours.accent};
  border-radius: ${(props) => props.theme!.borderRadius.sm};
`;

/**
 * Badge with text content
 */
export function TextBadge(props: Props) {
  return <Base>{props.children}</Base>;
}
