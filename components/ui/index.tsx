import { createEffect } from "solid-js";
import { useTheme } from "solid-styled-components";

export * from "./components";
export * from "./directives";
export { darkTheme } from "./themes/darkTheme";

export { ThemeProvider, styled, useTheme } from "solid-styled-components";
export type { DefaultTheme } from "solid-styled-components";

/**
 * Apply theme to document body
 */
export function ApplyGlobalStyles() {
  const theme = useTheme();

  createEffect(() => {
    // Inject common theme styles
    Object.assign(document.body.style, {
      "font-family": theme.fonts.primary,
      background: theme.colours.background,
      color: theme.colours.foreground,
    });

    // Set default emoji size
    document.body.style.setProperty("--emoji-size", theme.layout.emoji.small);
  });

  return <></>;
}

/**
 * Export directive typing
 */
declare module "solid-js" {
  // eslint-disable-next-line
  namespace JSX {
    interface Directives {
      scrollable:
        | true
        | {
            /**
             * Scroll direction
             */
            direction?: "x" | "y";

            /**
             * Offset to apply to top of scroll container
             */
            offsetTop?: number;

            /**
             * Whether to only show scrollbar on hover
             */
            showOnHover?: boolean;
          };
      invisibleScrollable:
        | true
        | {
            /**
             * Scroll direction
             */
            direction?: "x" | "y";
          };
    }
  }
}
