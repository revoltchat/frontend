import { defineKeyframes } from "@pandacss/dev";
import { styled } from "styled-system/jsx";

/**
 * Animation for spinner
 */
const skSpinner = defineKeyframes({
  fadeIn: {
    "0%, 80%, 100%": {
      transform: "scale(0)",
    },
    "40%": {
      transform: "scale(1.0)",
    },
  },
});

/**
 * Animation for ring
 */
const prRing = defineKeyframes({
  fadeIn: {
    "0%": {
      transform: "rotate(0deg)",
    },
    "100%": {
      transform: "rotate(360deg)",
    },
  },
});

/**
 * Preloader component styling
 */
const PreloaderBase = styled("div", {
  base: {
    height: "fit-content",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    "& .spinner": {
      width: "58px",
      display: "flex",
      textAlign: "center",
      justifyContent: "space-between",
    },

    "& .spinner > div": {
      width: "14px",
      height: "14px",
      background: "var(--colours-component-preloader-foreground)",

      borderRadius: "100%",
      display: "inline-block",
      animation: `${skSpinner} 1.4s infinite ease-in-out both`,
    },

    "& .spinner div:nth-child(1)": {
      animationDelay: "-0.32s",
    },

    "& .spinner div:nth-child(2)": {
      animationDelay: "-0.16s",
    },

    "& .ring": {
      display: "inline-block",
      position: "relative",
      width: "48px",
      height: "52px",
    },

    "& .ring div": {
      width: "32px",
      margin: "8px",
      height: "32px",
      display: "block",
      position: "absolute",
      borderRadius: "50%",
      boxSizing: "border-box",
      border: "2px solid var(--colours-foreground)",
      animation: `${prRing} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite`,
      borderColor:
        "var(--colours-foreground) transparent transparent transparent",
    },

    "& .ring div:nth-child(1)": {
      animationDelay: "-0.45s",
    },

    "& .ring div:nth-child(2)": {
      animationDelay: "-0.3s",
    },

    "& .ring div:nth-child(3)": {
      animationDelay: "-0.15s",
    },
  },
  variants: {
    grow: {
      true: {
        height: "100%",
      },
    },
  },
});

interface Props {
  type: "spinner" | "ring";
  grow?: boolean;
}

/**
 * Generic loading indicator with no progress indicator
 *
 * @deprecated use new loading indicators
 */
export function Preloader(props: Props) {
  return (
    <PreloaderBase grow={props.grow}>
      <div class={props.type}>
        <div />
        <div />
        <div />
      </div>
    </PreloaderBase>
  );
}
