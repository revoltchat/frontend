import { styled } from "solid-styled-components";

export const ComboBox = styled("select")`
  padding: 11px 16px;

  font-size: 0.9375rem;
  font-family: inherit;
  font-weight: 500;

  color: ${({ theme }) => theme!.colours.foreground};
  background: ${({ theme }) => theme!.colours["background-100"]};

  border: none;
  border-radius: ${({ theme }) => theme!.borderRadius.md};
  box-sizing: border-box;

  outline: none;
  cursor: pointer;

  transition: 0.1s ease-in-out all;

  &:focus-visible {
    box-shadow: 0 0 0 1.5pt var(--accent);
  }
`;
