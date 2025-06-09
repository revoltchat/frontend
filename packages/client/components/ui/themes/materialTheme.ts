import {
  argbFromHex,
  hexFromArgb,
  themeFromSourceColor,
} from "@material/material-color-utilities";

import { SelectedTheme } from "@revolt/state/stores/Theme";

/**
 * Generate the Material variables from the given properties
 *
 * Currently only generates color keys
 */
export function createMaterialColourVariables<P extends string>(
  theme: SelectedTheme,
  prefix: P,
): addPrefixToObject<MaterialColours, P> {
  switch (theme.preset) {
    case "neutral":
      return Object.entries(AndroidNeutralColours)
        .filter(([key]) =>
          theme.darkMode ? key.endsWith("-dark") : key.endsWith("-light"),
        )
        .reduce(
          (d, [key, value]) => ({
            ...d,
            [`${prefix}${key.replace(/-dark|-light/, "")}`]: value,
          }),
          {},
        ) as never;
    case "you":
      return Object.entries(
        generateMaterialYouScheme(theme.accent, theme.darkMode),
      ).reduce(
        (d, [key, value]) => ({
          ...d,
          [`${prefix}${key}`]: value,
        }),
        {} as addPrefixToObject<MaterialColours, P>,
      );
    default:
      return {} as never;
  }
}

/**
 * Create R,G,B triplets for MDUI variables
 */
export function createMduiColourTriplets<P extends string>(
  theme: SelectedTheme,
  prefix: P,
): addPrefixToObject<MaterialColours, P> {
  const variables = createMaterialColourVariables(theme, prefix);

  for (const key in variables) {
    console.info(variables, key);
    const [_, r, g, b] = /#([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})/i.exec(
      variables[key as keyof typeof variables] as string,
    )!;

    variables[key as keyof typeof variables] =
      `${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(b, 16)}` as never;
  }

  return variables;
}

type addPrefixToObject<T, P extends string> = {
  [K in keyof T as K extends string ? `${P}${K}` : never]: T[K];
};

type addSuffixToObject<T, S extends string> = {
  [K in keyof T as K extends string ? `${K}${S}` : never]: T[K];
};

type MaterialColours = {
  primary: string;
  "on-primary": string;
  "primary-container": string;
  "on-primary-container": string;
  secondary: string;
  "on-secondary": string;
  "secondary-container": string;
  "on-secondary-container": string;
  tertiary: string;
  "on-tertiary": string;
  "tertiary-container": string;
  "on-tertiary-container": string;
  error: string;
  "on-error": string;
  "error-container": string;
  "on-error-container": string;

  "primary-fixed": string;
  "primary-fixed-dim": string;
  "on-primary-fixed": string;
  "on-primary-fixed-variant": string;
  "secondary-fixed": string;
  "secondary-fixed-dim": string;
  "on-secondary-fixed": string;
  "on-secondary-fixed-variant": string;
  "tertiary-fixed": string;
  "tertiary-fixed-dim": string;
  "on-tertiary-fixed": string;
  "on-tertiary-fixed-variant": string;

  "surface-dim": string;
  surface: string;
  "surface-bright": string;

  "surface-container-lowest": string;
  "surface-container-low": string;
  "surface-container": string;
  "surface-container-high": string;
  "surface-container-highest": string;

  "on-surface": string;
  "on-surface-variant": string;
  outline: string;
  "outline-variant": string;

  "inverse-surface": string;
  "inverse-on-surface": string;
  "inverse-primary": string;

  scrim: string;
  shadow: string;
};

/**
 * Generate a Material You colour scheme
 * @param accent Accent colour in hex format
 * @param darkMode Dark mode
 * @returns Material colours
 */
function generateMaterialYouScheme(accent: string, darkMode: boolean) {
  // Do most of the work using external library
  const theme = themeFromSourceColor(argbFromHex(accent));

  // Select the scheme we want and reformat (scheme is camelCase)
  const scheme = Object.entries(
    theme.schemes[darkMode ? "dark" : "light"].toJSON(),
  ).reduce(
    (d, [k, v]) => ({
      ...d,
      [k.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()]: hexFromArgb(v),
    }),
    {},
  );

  // Generate fixed variants and surface variants
  // https://github.com/material-foundation/material-color-utilities/issues/158
  const { primary, secondary, tertiary, neutral } = theme.palettes;

  const fixed = {
    "primary-fixed": hexFromArgb(primary.tone(90)),
    "primary-fixed-dim": hexFromArgb(neutral.tone(80)),
    "on-primary-fixed": hexFromArgb(primary.tone(10)),
    "on-primary-fixed-variant": hexFromArgb(primary.tone(30)),
    "secondary-fixed": hexFromArgb(secondary.tone(90)),
    "secondary-fixed-dim": hexFromArgb(secondary.tone(80)),
    "on-secondary-fixed": hexFromArgb(secondary.tone(10)),
    "on-secondary-fixed-variant": hexFromArgb(secondary.tone(30)),
    "tertiary-fixed": hexFromArgb(tertiary.tone(90)),
    "tertiary-fixed-dim": hexFromArgb(tertiary.tone(80)),
    "on-tertiary-fixed": hexFromArgb(tertiary.tone(10)),
    "on-tertiary-fixed-variant": hexFromArgb(tertiary.tone(30)),
  };

  const surface = darkMode
    ? {
        "surface-dim": hexFromArgb(neutral.tone(6)),
        "surface-bright": hexFromArgb(neutral.tone(24)),
        "container-lowest": hexFromArgb(neutral.tone(4)),
        "surface-container-low": hexFromArgb(neutral.tone(10)),
        "surface-container": hexFromArgb(neutral.tone(12)),
        "surface-container-high": hexFromArgb(neutral.tone(17)),
        "surface-container-highest": hexFromArgb(neutral.tone(22)),
      }
    : {
        "surface-dim": hexFromArgb(neutral.tone(87)),
        "surface-bright": hexFromArgb(neutral.tone(98)),
        "surface-container-lowest": hexFromArgb(neutral.tone(100)),
        "surface-container-low": hexFromArgb(neutral.tone(96)),
        "surface-container": hexFromArgb(neutral.tone(94)),
        "surface-container-high": hexFromArgb(neutral.tone(92)),
        "surface-container-highest": hexFromArgb(neutral.tone(90)),
      };

  return {
    ...scheme,
    ...fixed,
    ...surface,
  } as MaterialColours;
}

/**
 * Colours imported from Revolt for Android project
 * https://github.com/revoltchat/android/blob/dev/app/src/main/java/chat/revolt/ui/theme/Colour.kt
 */
const AndroidNeutralColours:
  | addSuffixToObject<MaterialColours, "-light">
  | addSuffixToObject<MaterialColours, "-dark"> = {
  // "revolt-ultra-pink": "#ff005c",

  "primary-light": "#bd0042",
  "on-primary-light": "#ffffff",
  "primary-container-light": "#ffd9dc",
  "on-primary-container-light": "#910031",
  "secondary-light": "#c0001f",
  "on-secondary-light": "#ffffff",
  "secondary-container-light": "#ffdad7",
  "on-secondary-container-light": "#930015",
  "tertiary-light": "#0060a9",
  "on-tertiary-light": "#ffffff",
  "tertiary-container-light": "#d3e4ff",
  "on-tertiary-container-light": "#004881",
  "error-light": "#c0001f",
  "on-error-light": "#ffffff",
  "error-container-light": "#ffdad7",
  "on-error-container-light": "#410004",
  // @ts-expect-error mismatch
  "background-light": "#f9f9ff",
  "on-background-light": "#161b27",
  "surface-light": "#f9f9ff",
  "on-surface-light": "#161b27",
  "surface-variant-light": "#dce2f5",
  "on-surface-variant-light": "#404756",
  "outline-light": "#717788",
  "outline-variant-light": "#c0c6d9",
  "scrim-light": "#000000",
  "inverse-surface-light": "#2b303d",
  "inverse-on-surface-light": "#edf0ff",
  "inverse-primary-light": "#ffb2ba",
  "surface-dim-light": "#d5d9ea",
  "surface-bright-light": "#f9f9ff",
  "surface-container-lowest-light": "#ffffff",
  "surface-container-low-light": "#f1f3ff",
  "surface-container-light": "#e9edfe",
  "surface-container-high-light": "#e4e8f8",
  "surface-container-highest-light": "#dee2f2",

  "primary-dark": "#ffb2ba",
  "on-primary-dark": "#670020",
  "primary-container-dark": "#910031",
  "on-primary-container-dark": "#ffd9dc",
  "secondary-dark": "#ffb3ae",
  "on-secondary-dark": "#68000c",
  "secondary-container-dark": "#930015",
  "on-secondary-container-dark": "#ffdad7",
  "tertiary-dark": "#a2c9ff",
  "on-tertiary-dark": "#00315b",
  "tertiary-container-dark": "#004881",
  "on-tertiary-container-dark": "#d3e4ff",
  "error-dark": "#ffb3ae",
  "on-error-dark": "#68000c",
  "error-container-dark": "#930015",
  "on-error-container-dark": "#ffdad7",
  "background-dark": "#0e131e",
  "on-background-dark": "#dee2f2",
  "surface-dark": "#0e131e",
  "on-surface-dark": "#dee2f2",
  "surface-variant-dark": "#404756",
  "on-surface-variant-dark": "#c0c6d9",
  "outline-dark": "#8a90a2",
  "outline-variant-dark": "#404756",
  "scrim-dark": "#000000",
  "inverse-surface-dark": "#dee2f2",
  "inverse-on-surface-dark": "#2b303d",
  "inverse-primary-dark": "#bd0042",
  "surface-dim-dark": "#0e131e",
  "surface-bright-dark": "#343946",
  "surface-container-lowest-dark": "#090e19",
  "surface-container-low-dark": "#161b27",
  "surface-container-dark": "#1a202b",
  "surface-container-high-dark": "#252a36",
  "surface-container-highest-dark": "#303541",
};
