/// <reference path="./types/styled.d.ts" />

export * from "./components";
export { darkTheme } from "./themes/darkTheme";

import { createEffect } from "solid-js";
import { useTheme } from "solid-styled-components";
export { ThemeProvider, styled } from "solid-styled-components";

/**
 * Apply theme to document body
 */
export function ApplyGlobalStyles() {
  const theme = useTheme();

  createEffect(() => {
    Object.assign(document.body.style, {
      "font-family": theme.fonts.primary,
      background: theme.colours.background,
    });

    document.body.style.setProperty("--emoji-size", theme.layout.emoji.small);
  });

  return <></>;
}
