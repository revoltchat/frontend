// ! TODO: this is a direct port of the Button
// ! this will need to be polished up and rewritten for solid-styled-components

import type { JSX } from "solid-js/jsx-runtime";
import { styled } from "solid-styled-components";

export interface Props {
  /**
   * Whether to display a smaller or icon button
   */
  readonly compact?: boolean | "icon";

  /**
   * Colour scheme
   */
  readonly palette?:
    | "primary"
    | "secondary"
    | "plain"
    | "plain-secondary"
    | "accent"
    | "success"
    | "warning"
    | "error";
}

/**
 * Determine button sizing based on the provided value
 */
 function buttonSizing(compact: boolean | "icon") {
  return compact === "icon" ? `
    height: 38px;
    width: 38px;
  `
  : compact ? `
    min-width: 96px;
    font-size: 0.8125rem;
    height: 32px !important;
    padding: 2px 12px !important;
  `
  : `
    height: 38px;
    min-width: 96px;
    padding: 2px 16px;
    font-size: 0.8125rem;
  `
}


/**
 * Common button styles 
*/
function buttonBase (compact: boolean | "icon") {
  return `
  z-index: 1;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;
  font-weight: 500;
  font-family: inherit;

  border: none;
  cursor: pointer;

  ${buttonSizing(compact)}
  
  &:disabled {
    cursor: not-allowed;
  }`}

const PrimaryButton = styled("button")<Props>`
  ${(props) => (buttonBase(props.compact ?? false))}
  border-radius: ${({ theme }) => theme!.borderRadius.md};
  transition: ${({ theme }) => theme!.transitions.fast} all;

  color: ${({ theme }) => (theme!.colours["foreground"])};
  background: ${({ theme }) => (theme!.colours["background-100"])};

  &:hover {
    background: ${({ theme }) => (theme!.colours["background-200"])};
  }

  &:disabled {
    background: ${({ theme }) => (theme!.colours["background-200"])};
  }

  &:active {
    background: ${({ theme }) => (theme!.colours["background-100"])};
  }`;

const SecondaryButton = styled("button")<Props>`
  ${(props) => (buttonBase(props.compact ?? false))}
  border-radius: ${({ theme }) => theme!.borderRadius.md};
  transition: ${({ theme }) => theme!.transitions.fast} all;

  color: ${({ theme }) => (theme!.colours["foreground"])};
  background: ${({ theme }) => (theme!.colours["background-200"])};

  &:hover {
    background: ${({ theme }) => (theme!.colours["background-300"])};
  }

  &:disabled {
    background: ${({ theme }) => (theme!.colours["background-200"])}
  }

  &:active {
    background: ${({ theme }) => (theme!.colours["background-100"])};
  }
;`

const PlainButton = styled("button")<Props>`
  ${(props) => (buttonBase(props.compact ?? false))}
  border-radius: ${({ theme }) => theme!.borderRadius.md};
  transition: ${({ theme }) => theme!.transitions.fast} all;

  color: ${( props ) => (
    props.palette === "plain"
      ? props.theme!.colours["foreground"]
      : props.theme!.colours["foreground-200"])
  };
  background: transparent;

  &:hover {
    text-decoration: underline;
  }

  &:disabled {
    opacity: 0.5;
  }

  &:active {
    color: ${({ theme }) => (theme!.colours["foreground-400"])};
  }
`

const AccentedButton = styled("button")<Props>`
  ${(props) => (buttonBase(props.compact ?? false))}
  border-radius: ${({ theme }) => theme!.borderRadius.md};
  transition: ${({ theme }) => theme!.transitions.fast} all;
  
  font-weight: 600;
  background: ${(props) => (props.theme!.colours[props.palette])};

  &:hover {
    filter: brightness(1.2);
  }

  &:active {
    filter: brightness(0.8);
  }

  &:disabled {
    filter: brightness(0.7);
  }
  `

type ButtonProps = Props & JSX.HTMLAttributes<any>;

/**
 * Button element
 */
export const Button = (props: ButtonProps) => {
  const palette = props.palette ?? "primary";
  switch (palette) {
    case "secondary":
      return <SecondaryButton {...props} />
    case "plain":
    case "plain-secondary":
      return <PlainButton {...props} />
    case "accent":
    case "success":
    case "warning":
    case "error":
      return <AccentedButton {...props} />
    default:
    case "primary":
      return <PrimaryButton {...props} />
  }
};
