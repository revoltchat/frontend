import { DefaultTheme } from "solid-styled-components";

import {
  ColorGroup,
  CustomColorGroup,
  Hct,
  Scheme,
  TonalPalette,
  argbFromHex,
  hexFromArgb,
  themeFromSourceColor,
} from "@material/material-color-utilities";

// const hex = '#d59ff5';
//const hex = "#FF7F50";
//const hex = "#B4CBAF";
const hex = "#8C5FD3";
const darkMode = false;
const theme = themeFromSourceColor(argbFromHex(hex), [
  {
    name: "status-online",
    value: argbFromHex("#3ABF7E"),
    blend: true,
  },
  {
    name: "status-idle",
    value: argbFromHex("#F39F00"),
    blend: true,
  },
  {
    name: "status-focus",
    value: argbFromHex("#4799F0"),
    blend: true,
  },
  {
    name: "status-busy",
    value: argbFromHex("#F84848"),
    blend: true,
  },
  {
    name: "status-invisible",
    value: argbFromHex("#A5A5A5"),
    blend: true,
  },
]);

const customColours = {} as Record<
  `status-${"online" | "idle" | "focus" | "busy" | "streaming" | "invisible"}`,
  Record<keyof ColorGroup, string>
>;

for (const c of theme.customColors) {
  const output: Record<string, string> = {};
  const source = c[darkMode ? "dark" : "light"] as unknown as Record<
    string,
    number
  >;

  Object.keys(source).forEach(
    (key) => (output[key] = hexFromArgb(source[key]))
  );

  (customColours as Record<string, Record<keyof ColorGroup, string>>)[
    c.color.name
  ] = output as Record<keyof ColorGroup, string>;
}

/**
 * Convert a scheme to usable hex colours
 * @param scheme Scheme
 * @returns Hex Scheme
 */
function schemeToHex(scheme: Scheme) {
  const hexScheme = {} as Record<keyof Scheme, string>;
  const toneScheme = {} as Record<keyof Scheme, TonalPalette>;

  (
    Object.keys(
      Object.getOwnPropertyDescriptors(Object.getPrototypeOf(scheme))
    ) as (keyof Scheme)[]
  )
    .filter((key) => typeof scheme[key] === "number")
    .forEach((key) => {
      const colour = Hct.fromInt(scheme[key] as number);
      hexScheme[key] = hexFromArgb(colour.toInt());
      toneScheme[key] = TonalPalette.fromInt(colour.toInt());
    });

  return {
    scheme: hexScheme,
    tones: toneScheme,
  };
}

export const darkTheme: DefaultTheme = {
  /**
   * Colour time
   * todo
   */
  colour(base: keyof Scheme, tone?: number): string {
    return tone
      ? hexFromArgb(
        darkTheme.tones[base].getHct(darkMode ? 100 - tone : tone).toInt()
      )
      : darkTheme.scheme[base];
  },
  ...schemeToHex(theme.schemes[darkMode ? "dark" : "light"]),
  customColours,
  colours: {},
  rgb: {
    header: "54,54,54",
    "typing-indicator": "30,30,30",
  },
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  },
  borderRadius: {
    sm: "2px",
    md: "6px",
    lg: "12px",
    xl: "16px",
    xxl: "28px",
    full: "100%",
  },
  gap: {
    none: "0",
    xxs: "1px",
    xs: "2px",
    s: "6px",
    sm: "4px",
    md: "8px",
    l: "12px",
    lg: "15px",
    xl: "32px",
    xxl: "64px",
  },
  fonts: {
    primary: '"Inter", sans-serif',
    monospace: '"JetBrains Mono", monospace',
  },
  typography: {
    // Form elements
    label: {
      fontWeight: 700,
      fontSize: "0.75rem",
      textTransform: "uppercase",
    },
    // Common UI elements
    chip: {
      fontWeight: 500,
      fontSize: "12px",
    },
    username: {
      fontWeight: 600,
    },
    status: {
      fontSize: "11px",
      fontWeight: 400,
    },
    tooltip: {
      fontWeight: 600,
      fontSize: "13px",
    },
    category: {
      fontWeight: 600,
      fontSize: "0.7rem",
    },
    "menu-button": {
      fontWeight: 600,
      fontSize: "0.90625rem",
    },
    "sidebar-title": {
      margin: 0,
      element: "h1",
      fontWeight: 600,
      fontSize: "1.2rem",
    },
    "channel-topic": {
      fontWeight: 400,
      fontSize: "0.8em",
    },
    // Messaging specific
    messages: {
      fontSize: "14px",
      fontWeight: 300,
    },
    reply: {
      fontSize: "0.8rem",
    },
    "composition-file-upload-name": {
      fontSize: "0.8em",
    },
    "composition-file-upload-size": {
      fontSize: "0.6em",
    },
    "composition-typing-indicator": {
      element: "div",
      fontSize: "13px",
    },
    "conversation-channel-name": {
      element: "h1",
      fontSize: "23px",
      margin: "0 0 8px 0",
    },
    "conversation-start": {
      element: "h4",
      fontWeight: 400,
      margin: 0,
      fontSize: "14px",
    },
    "jump-to-bottom": {
      fontSize: "12px",
      fontWeight: 600,
    },
    "system-message": {
      fontWeight: 700,
    },
    // Settings
    "settings-title": {
      element: "h1",
      margin: 0,
      fontWeight: 500,
      fontSize: "1.75rem",
    },
    "settings-account-username": {
      fontSize: "20px",
      fontWeight: 600,
    },
    "settings-account-card-title": {
      fontWeight: 600,
    },
    "settings-account-card-subtitle": {
      fontSize: "12px",
    },
    // Legacy
    "legacy-settings-title": {
      element: "h1",
      margin: 0,
      lineHeight: "1rem",
      fontWeight: 600,
      fontSize: "1.2rem",
    },
    small: {
      fontSize: "0.7rem",
    },
    "legacy-modal-title": {
      element: "h2",
      margin: 0,
      fontWeight: 700,
      fontSize: "0.9375rem",
    },
    "legacy-settings-section-title": {
      element: "h3",
      margin: 0,
      fontWeight: 700,
      fontSize: "0.75rem",
    },
    "legacy-modal-title-2": {
      element: "h4",
      margin: 0,
      fontWeight: 500,
      fontSize: "0.8125rem",
    },
    "legacy-settings-description": {
      element: "span",
      margin: 0,
      fontWeight: 500,
      fontSize: "0.8rem",
    },
  },
  transitions: {
    fast: ".1s ease-in-out",
    medium: ".2s ease",
  },
  effects: {
    blur: {
      md: "blur(20px)",
    },
    muted: "brightness(0.5) saturate(0.75)",
    hover: "brightness(1.1)",
    active: "brightness(0.9)",
    spoiler: "brightness(0.2) contrast(0.8) blur(24px)",
  },
  layout: {
    width: {
      "channel-sidebar": "232px",
    },
    height: {
      header: "48px",
      "tall-header": "120px",
      "message-box": "48px",
      "attachment-preview": "100px",
    },
    attachments: {
      "min-width": "240px",
      "max-width": "420px",
      "min-height": "120px",
      "max-height": "420px",
    },
    emoji: {
      small: "1.4em",
      medium: "48px",
      large: "96px",
    },
  },
};

console.info(darkTheme);
