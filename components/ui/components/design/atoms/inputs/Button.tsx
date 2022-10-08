// ! TODO: this is a direct port of the Button
// ! this will need to be polished up and rewritten for solid-styled-components

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
 * Button element
 */
export const Button = styled("button")<Props>`
  z-index: 1;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;
  font-weight: 500;
  font-family: inherit;

  transition: ${(props) => props.theme!.transitions.fast} all;

  border: none;
  cursor: pointer;
  border-radius: ${({ theme }) => theme!.borderRadius.md};

  &:disabled {
    cursor: not-allowed;
  }

  ${(props) =>
    props.compact === "icon"
      ? `
                  height: 38px;
                  width: 38px;
              `
      : props.compact
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
              `}

  ${(props) => {
    switch (props.palette) {
      case "secondary":
        return `
                    font-weight: 500;
                    color: var(--foreground);
                    background: var(--secondary-header);

                    &:hover {
                        background: var(--primary-header);
                    }

                    &:disabled {
                        background: var(--secondary-header);
                    }

                    &:active {
                        background: var(--secondary-background);
                    }
                `;
      case "plain":
      case "plain-secondary":
        return `
                    color: ${
                      props.palette === "plain"
                        ? "var(--foreground)"
                        : "var(--secondary-foreground)"
                    };
                    background: transparent;

                    &:hover {
                        text-decoration: underline;
                    }

                    &:disabled {
                        opacity: 0.5;
                    }

                    &:active {
                        color: var(--tertiary-foreground);
                    }
                `;
      case "accent":
      case "success":
      case "warning":
      case "error":
        return `
                    font-weight: 600;
                    color: var(--${props.palette}-contrast);
                    background: var(--${props.palette});

                    &:hover {
                        filter: brightness(1.2);
                    }

                    &:active {
                        filter: brightness(0.8);
                    }

                    &:disabled {
                        filter: brightness(0.7);
                    }
                `;
      default:
      case "primary":
        return `
                    font-weight: 500;
                    color: ${props.theme!.colours["foreground"]};
                    background: ${props.theme!.colours["background-100"]};

                    &:hover {
                        background: var(--secondary-header);
                    }

                    &:disabled {
                        background: var(--primary-background);
                    }

                    &:active {
                        background: var(--secondary-background);
                    }
                `;
    }
  }}
`;
