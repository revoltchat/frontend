import type { JSX } from "solid-js/jsx-runtime";
import { styled } from "solid-styled-components";

export interface Props {
  /**
   * Whether to display a smaller or icon button
   */
  readonly compact?: boolean | "icon" | "fluid";

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
function buttonSizing(compact: boolean | "icon" | "fluid") {
  return compact === "fluid"
    ? ""
    : compact === "icon"
    ? `
    height: 38px;
    width: 38px;
  `
    : compact
    ? `
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
  `;
}

/**
 * Common button styles
 */
const ButtonBase = styled("button")<Props>`
  z-index: 1;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;
  font-weight: 500;
  font-family: inherit;

  cursor: pointer;

  border: none;
  border-radius: ${({ theme }) => theme!.borderRadius.xxl};

  transition: ${({ theme }) => theme!.transitions.fast} all;

  ${(props) => buttonSizing(props.compact ?? false)}

  &:hover {
    filter: brightness(1.2);
  }

  &:active {
    filter: brightness(0.9);
  }

  &:disabled {
    cursor: not-allowed;
    filter: brightness(0.7);
  }
`;

const PrimaryButton = styled(ButtonBase)<Props>`
  color: ${({ theme }) => theme!.colour("primary")};
  background: ${({ theme }) => theme!.colour("background", 98)};
`;

const SecondaryButton = styled(ButtonBase)<Props>`
  color: ${({ theme }) => theme!.colour("primary")};
  background: ${({ theme }) => theme!.colour("background", 96)};
`;

const PlainButton = styled(ButtonBase)<Props>`
  color: ${(props) =>
    props.palette === "plain"
      ? props.theme!.colour("onBackground")
      : props.theme!.colour("onBackground", 92)};
  background: transparent;

  &:hover {
    text-decoration: underline;
  }

  &:disabled {
    text-decoration: none;
  }
`;

const AccentedButton = styled(ButtonBase)<Props>`
  font-weight: 600;
  background: ${(props) =>
    props.theme!.colours[
      props.palette as "accent" | "success" | "warning" | "error"
    ]};
`;

export type ButtonProps = Props & JSX.ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * Button element
 */
export const Button = (props: ButtonProps) => {
  const palette = props.palette ?? "primary";
  switch (palette) {
    case "secondary":
      return <SecondaryButton {...props} />;
    case "plain":
    case "plain-secondary":
      return <PlainButton {...props} />;
    case "accent":
    case "success":
    case "warning":
    case "error":
      return <AccentedButton {...props} />;
    default:
    case "primary":
      return <PrimaryButton {...props} />;
  }
};
