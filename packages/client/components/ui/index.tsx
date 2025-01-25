import { createEffect } from "solid-js";

import { DefaultTheme } from "./styled";
export type { DefaultTheme } from "./styled";

export * from "./components";
export { darkTheme } from "./themes/darkTheme";

/**
 * Generate SVG props to configure icon size
 * @param size Target size
 * @param viewBox Custom view box if necessary
 * @returns Props
 */
export function iconSize(size: string | number, viewBox?: string) {
  return {
    width: size,
    height: size,
    viewBox: viewBox ?? "0 0 24 24",
  };
}

/**
 * Apply theme to document body
 */
export function ApplyGlobalStyles(props: { theme: DefaultTheme }) {
  createEffect(() => {
    // Inject common theme styles
    Object.assign(document.body.style, {
      "font-family": props.theme.fonts.primary,
      background: props.theme.colours.background,
      color: props.theme.colours.foreground,
    });

    // Set default emoji size
    document.body.style.setProperty(
      "--emoji-size",
      props.theme.layout.emoji.small
    );

    // Unset variables
    document.body.style.setProperty("--unset-fg", "red");
    document.body.style.setProperty(
      "--unset-bg",
      "repeating-conic-gradient(red 0% 25%, transparent 0% 50%) 50% / 5px 5px"
    );

    // Inject all theme properties
    function recursivelyInject(key: string, obj: any) {
      if (typeof obj === "object") {
        for (const subkey of Object.keys(obj)) {
          recursivelyInject(key + "-" + subkey, obj[subkey]);
        }
      } else {
        document.body.style.setProperty(`-${key}`, obj);
      }
    }

    recursivelyInject("", props.theme);
  });

  return <></>;
}
