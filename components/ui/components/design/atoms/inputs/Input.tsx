import { styled } from "solid-styled-components";

export interface Props {
  /**
   * Colour scheme
   */
  readonly palette?: "primary" | "secondary";

  /**
   * Whether a submission has been tried and errors should display on the input
   */
  readonly submissionTried?: boolean;
}

/**
 * Input element
 */
export const Input = styled("input")<Props>`
  width: 100%;
  margin: 0.2em 0;
  padding: 0.75em 1em;

  font-size: 0.9375rem;
  font-family: inherit;
  font-weight: 500;

  outline: none;
  border: 2px solid transparent;
  border-radius: ${({ theme }) => theme!.borderRadius.md};

  transition: ${(props) => props.theme!.transitions.fast} all;

  &:disabled {
    filter: brightness(0.9);
  }

  &:focus-visible {
    box-shadow: 0 0 0 1.5pt ${({ theme }) => theme!.colour("primary")};
  }

  color: ${(props) =>
    props.theme!.colour("onBackground")};

  background: ${(props) =>
    props.theme!.colour("background", props.palette === "primary" ? 100 : 98)};

  &:hover {
    background: ${(props) =>
      props.theme!.colour("background", props.palette === "primary" ? 98 : 100)};
  }

  ${(props) =>
    props.submissionTried
      ? `&:invalid { border-color: ${props.theme!.colours["status-busy"]}; }`
      : ""}

  &:focus {
    outline-offset: 4px;
    border-color: ${(props) => props.theme!.colours["status-idle"]};
  }

  &:valid {
    border-color: transparent;
  }

  /* Override Chrome's ugly autofill colours */
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px
      ${(props) => props.theme!.colour("background", 98)} inset !important;
  }

  &:-webkit-autofill {
    caret-color: ${(props) => props.theme!.colour("onBackground")} !important;
    -webkit-text-fill-color: ${(props) =>
      props.theme!.colour("onBackground")} !important;
  }
`;
