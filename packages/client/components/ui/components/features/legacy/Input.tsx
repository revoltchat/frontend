import { styled } from "styled-system/jsx";

interface Props {
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
 *
 * @deprecated Use TextField instead
 */
export const Input = styled("input", {
  base: {
    width: "100%",
    margin: "0.2em 0",
    padding: "0.75em 1em",
    fontSize: "0.9375rem",
    fontFamily: "inherit",
    fontWeight: 500,
    outline: "none",
    border: "2px solid transparent",
    borderRadius: "var(--borderRadius-md)",
    transition: "var(--transitions-fast) all",
    "&:disabled": {
      filter: "brightness(0.9)",
    },
    "&:focus-visible": {
      boxShadow: "0 0 0 1.5pt var(--colours-component-input-focus)",
    },
    color: "var(--colours-component-input-foreground)",
    "&:hover": {
      background: "var(--colours-component-input-hover-primary)",
    },
    "&:focus": {
      outlineOffset: "4px",
      borderColor: "var(--customColours-warning-color)",
    },
    "&:valid": {
      borderColor: "transparent",
    },
    // TODO: bring this back
    // "&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus, &:-webkit-autofill:active":
    //   {
    //     "-webkit-box-shadow":
    //       "0 0 0 30px var(--colours-component-input-background-primary) inset !important",
    //     caretColor: "var(--colours-component-input-foreground) !important",
    //     "-webkit-text-fill-color":
    //       "var(--colours-component-input-foreground) !important",
    //   },
  },
  variants: {
    palette: {
      primary: {
        background: "var(--colours-component-input-background-primary)",
      },
      secondary: {
        background: "var(--colours-component-input-background-secondary)",
      },
    },
    submissionTried: {
      true: {
        "&:invalid": {
          borderColor: "var(--customColours-error-color)",
        },
      },
    },
  },
});
