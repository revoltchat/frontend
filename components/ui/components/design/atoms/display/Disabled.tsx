import { styled } from "solid-styled-components";

/**
 * Disabled
 */
export const Disabled = styled.div<{ enabled?: boolean }>`
  transition: ${(props) => props.theme!.transitions.fast} filter;
  cursor: ${(props) => (props.enabled ? "inherit" : "not-allowed")};
  filter: ${(props) => (props.enabled ? "unset" : "brightness(0.8)")};

  * {
    pointer-events: ${(props) => (props.enabled ? "inherit" : "none")};
  }
`;
