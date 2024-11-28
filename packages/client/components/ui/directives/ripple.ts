import { Accessor, JSX } from "solid-js";

import { cva } from "styled-system/css";

/**
 * Generate class names for ripple
 */
export const hoverStyles = cva({
  base: {
    overflow: "hidden",
    position: "relative",

    // just the hover effect
    "&::before": {
      content: "' '",
      position: "absolute",
      width: "100%",
      height: "100%",

      opacity: 0,
      zIndex: -1,
      transform: "scale(2)",
      pointerEvents: "none",
      background: "black", // TODO: dark/light dependent

      transition: "var(--transitions-fast)",
    },

    // make the hover effect visible on hover
    "&:hover::before": {
      opacity: "var(--effects-ripple-hover)",
    },
  },
  variants: {
    ripple: {
      true: {
        // ripple effect
        "&::after": {
          content: "' '",
          position: "absolute",
          width: "100%",
          aspectRatio: 1,

          zIndex: 0,
          borderRadius: "50%",
          transform: "scale(0)",
          pointerEvents: "none",

          background: "black", // TODO: dark/light dependent
          opacity: "var(--effects-ripple-hover)",

          transition: "var(--transitions-medium)",
        },

        // make the ripple effect occur on click
        "&:active::after": {
          transform: "scale(8)",
        },
      },
      false: {},
    },
  },
});

/**
 * Add styles and events for ripple
 * @param el Element
 * @param accessor Parameters
 */
export function ripple(
  el: HTMLDivElement,
  accessor: Accessor<JSX.Directives["ripple"] & object>
) {
  const props = accessor();
  if (!props) return;
}
