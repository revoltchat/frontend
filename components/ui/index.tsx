import { createEffect } from "solid-js";
import { useTheme } from "solid-styled-components";

/// <reference path="./types/styled.d.ts" />

export * from "./components";
export { darkTheme } from "./themes/darkTheme";

export { ThemeProvider, styled } from "solid-styled-components";

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
