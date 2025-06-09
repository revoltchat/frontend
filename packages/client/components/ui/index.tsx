export type { DefaultTheme } from "./styled";

export * from "./components";

export { LoadTheme } from "./themes";

export { legacyThemeUnsetShim as darkTheme } from "./themes/legacyThemeGeneratorCode";

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
