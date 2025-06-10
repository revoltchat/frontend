import {
  ColorGroup,
  Hct,
  Scheme,
  TonalPalette,
  argbFromHex,
  hexFromArgb,
  themeFromSourceColor,
} from "@material/material-color-utilities";

import { DefaultTheme } from "./legacyStyled";

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
      Object.getOwnPropertyDescriptors(Object.getPrototypeOf(scheme)),
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

function hexToRgb(v: string) {
  const [_, r, g, b] = /#([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})/i.exec(v)!;
  return `${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(b, 16)}`;
}

/**
 * Create dark theme
 */
export const legacyThemeUnsetShim: (
  accentColour?: string,
  darkMode?: boolean,
) => DefaultTheme = (accentColour = "#FF5733", darkMode = false) => {
  // const hex = "#d59ff5";
  // const hex = "#FF7F50";
  // const hex = "#B4CBAF"; // Green
  // const hex = "#8C5FD3"; // Purple
  // const accentColour = "#FF5733"; // Coral Orange
  // const darkMode = false;
  const theme = themeFromSourceColor(argbFromHex(accentColour), [
    {
      name: "success",
      value: argbFromHex("#65E572"),
      blend: true,
    },
    {
      name: "warning",
      value: argbFromHex("#FAA352"),
      blend: true,
    },
    {
      name: "error",
      value: argbFromHex("#FF3322"),
      blend: true,
    },
  ]);

  // TEMP; https://github.com/material-foundation/material-color-utilities/issues/158
  const { primary, secondary, tertiary, neutral } = theme.palettes;

  const lightColors = new Map<string, string>([
    ["--md-sys-color-primary-fixed", hexFromArgb(primary.tone(90))],
    ["--md-sys-color-primary-fixed-dim", hexFromArgb(neutral.tone(80))],
    ["--md-sys-color-on-primary-fixed", hexFromArgb(primary.tone(10))],
    ["--md-sys-color-on-primary-fixed-variant", hexFromArgb(primary.tone(30))],
    ["--md-sys-color-secondary-fixed", hexFromArgb(secondary.tone(90))],
    ["--md-sys-color-secondary-fixed-dim", hexFromArgb(secondary.tone(80))],
    ["--md-sys-color-on-secondary-fixed", hexFromArgb(secondary.tone(10))],
    [
      "--md-sys-color-on-secondary-fixed-variant",
      hexFromArgb(secondary.tone(30)),
    ],
    ["--md-sys-color-tertiary-fixed", hexFromArgb(tertiary.tone(90))],
    ["--md-sys-color-tertiary-fixed-dim", hexFromArgb(tertiary.tone(80))],
    ["--md-sys-color-on-tertiary-fixed", hexFromArgb(tertiary.tone(10))],
    [
      "--md-sys-color-on-tertiary-fixed-variant",
      hexFromArgb(tertiary.tone(30)),
    ],

    ["--md-sys-color-surface-dim", hexFromArgb(neutral.tone(87))],
    ["--md-sys-color-surface-bright", hexFromArgb(neutral.tone(98))],
    ["--md-sys-color-surface-container-lowest", hexFromArgb(neutral.tone(100))],
    ["--md-sys-color-surface-container-low", hexFromArgb(neutral.tone(96))],
    ["--md-sys-color-surface-container", hexFromArgb(neutral.tone(94))],
    ["--md-sys-color-surface-container-high", hexFromArgb(neutral.tone(92))],
    ["--md-sys-color-surface-container-highest", hexFromArgb(neutral.tone(90))],
  ]);

  const darkColors = new Map<string, string>([
    ["--md-sys-color-surface-dim", hexFromArgb(neutral.tone(6))],
    ["--md-sys-color-surface-bright", hexFromArgb(neutral.tone(24))],
    ["--md-sys-color-surface-container-lowest", hexFromArgb(neutral.tone(4))],
    ["--md-sys-color-surface-container-low", hexFromArgb(neutral.tone(10))],
    ["--md-sys-color-surface-container", hexFromArgb(neutral.tone(12))],
    ["--md-sys-color-surface-container-high", hexFromArgb(neutral.tone(17))],
    ["--md-sys-color-surface-container-highest", hexFromArgb(neutral.tone(22))],
  ]);

  // if (mode === ColorMode.LIGHT) {
  //   return lightColors;
  // } else {
  //   return new Map([...lightColors.entries(), ...darkColors.entries()]);
  // }
  // END TEMP

  const customColours = {
    "status-online": {
      color: "#3ABF7E",
      onColor: "black",
    },
    "status-idle": {
      color: "#F39F00",
      onColor: "black",
    },
    "status-focus": {
      color: "#4799F0",
      onColor: "black",
    },
    "status-busy": {
      color: "#F84848",
      onColor: "white",
    },
    "status-invisible": {
      color: "#A5A5A5",
      onColor: "black",
    },
  } as Record<
    | `status-${
        | "online"
        | "idle"
        | "focus"
        | "busy"
        | "streaming"
        | "invisible"}`
    | "success"
    | "warning"
    | "error",
    Record<keyof ColorGroup, string>
  >;

  for (const c of theme.customColors) {
    const output: Record<string, string> = {};
    const source = c[darkMode ? "dark" : "light"] as unknown as Record<
      string,
      number
    >;

    Object.keys(source).forEach(
      (key) => (output[key] = hexFromArgb(source[key])),
    );

    (customColours as Record<string, Record<keyof ColorGroup, string>>)[
      c.color.name
    ] = output as Record<keyof ColorGroup, string>;
  }

  const materialTheme = schemeToHex(theme.schemes[darkMode ? "dark" : "light"]);

  function materialColour(base: keyof Scheme, tone?: number) {
    return tone
      ? hexFromArgb(
          materialTheme.tones[base]
            .getHct(darkMode ? 100 - tone : tone)
            .toInt(),
        )
      : materialTheme.scheme[base];
  }

  return {
    colours: {
      // Global
      link: "#0088ce",
      background: materialColour("background"),
      foreground: materialColour("onBackground"),
      // Component: Button
      "component-btn-background-primary": materialColour("primary"),
      "component-btn-foreground-primary": materialColour("onBackground", 98),
      "component-btn-background-secondary": materialColour("surfaceVariant"),
      "component-btn-foreground-secondary": materialColour(
        "onSurfaceVariant",
        30,
      ),
      "component-btn-foreground-plain": materialColour("onBackground"),
      "component-btn-foreground-plain-secondary": materialColour(
        "onBackground",
        40,
      ),
      // Component: Breadcrumbs
      "component-breadcrumbs-foreground": materialColour("onBackground", 60),
      "component-breadcrumbs-foreground-active": materialColour("onBackground"),
      // Component: Menu Button
      "component-menubtn-default-background": "transparent",
      "component-menubtn-default-foreground": materialColour(
        "onSurfaceVariant",
        55,
      ),
      "component-menubtn-selected-background": materialColour("surfaceVariant"),
      "component-menubtn-selected-foreground": materialColour(
        "onSurfaceVariant",
        30,
      ),
      "component-menubtn-muted-background": "transparent",
      "component-menubtn-muted-foreground": materialColour(
        "onSurfaceVariant",
        45,
      ),
      "component-menubtn-hover-background": materialColour("surfaceVariant"), // DEPRECATE
      "component-menubtn-hover-foreground": materialColour(
        // DEPRECATE
        "onSurfaceVariant",
        25,
      ),
      // Component: Input
      "component-input-focus": materialColour("primary"),
      "component-input-foreground": materialColour("onBackground"),
      "component-input-background-primary": materialColour("background", 100),
      "component-input-background-secondary": materialColour("background", 98),
      "component-input-hover-primary": materialColour("background", 98), // DEPRECATE?
      "component-input-hover-secondary": materialColour("background", 100), // DEPRECATE?
      // Component: Checkbox
      "component-checkbox-background": materialColour("primary", 92),
      "component-checkbox-foreground": materialColour("primary"),
      "component-checkbox-foreground-check": materialColour("onPrimary"),
      // Component: FAB
      "component-fab-background": materialColour("primary"),
      "component-fab-foreground": materialColour("primary", 90),
      // Component: Scrollbar
      "component-scrollbar-background": "transparent",
      "component-scrollbar-foreground": materialColour("primary", 85),

      // --------------

      // Component: Category Button
      "component-categorybtn-background": materialColour("background", 99),
      "component-categorybtn-background-icon": materialColour("primary", 90),
      "component-categorybtn-background-collapse": materialColour(
        "background",
        97,
      ),
      "component-categorybtn-background-hover": materialColour(
        "background",
        100,
      ),
      "component-categorybtn-background-active": materialColour(
        "background",
        94,
      ),
      "component-categorybtn-foreground": materialColour("onBackground", 10),
      "component-categorybtn-foreground-description": materialColour(
        "onBackground",
        30,
      ),
      // Component: Modal
      "component-modal-background": materialColour("secondary", 96),
      "component-modal-foreground": materialColour("onBackground"),
      // Component: Avatar (Fallback)
      "component-avatar-fallback-background": materialColour(
        "onBackground",
        94,
      ),
      "component-avatar-fallback-foreground": materialColour("onBackground"),
      "component-avatar-fallback-contrast-background":
        materialColour("primary"),
      "component-avatar-fallback-contrast-foreground":
        materialColour("onPrimary"),
      // Component: Context Menu
      "component-context-menu-background": materialColour("surfaceVariant", 97),
      "component-context-menu-foreground": materialColour("onSurface"),
      "component-context-menu-item-hover-background": materialColour(
        "surfaceVariant",
        92,
      ),
      "component-context-menu-divider": materialColour("onSurface", 92),
      "component-context-menu-shadow": "#0004",
      // Component: Key
      "component-key-background": materialColour("secondary"),
      "component-key-foreground": materialColour("onSecondary"),
      // Component: Combo Box
      "component-combo-focus": materialColour("primary"),
      "component-combo-foreground": materialColour("onBackground"),
      "component-combo-background": materialColour("background", 100),
      // Component: Preloader
      "preloader-foreground": materialColour("primary"),

      // Sidebar
      "sidebar-channels-background": materialColour("onBackground", 94),
      "sidebar-channels-foreground": materialColour("onPrimaryContainer"),
      "sidebar-members-background": materialColour("onBackground", 94),
      "sidebar-members-foreground": materialColour("onPrimaryContainer"),
      "sidebar-header-background": materialColour("onBackground", 94),
      "sidebar-header-foreground": materialColour("onPrimaryContainer"),
      "sidebar-header-transparent-background": `rgba(${hexToRgb(
        materialColour("onBackground", 94),
      )}, 0.75)`,
      "sidebar-header-with-image-text-background": `rgba(${hexToRgb(
        materialColour("onBackground"),
      )}, 0.5)`,
      "sidebar-header-with-image-text-foreground": materialColour("background"),
      "sidebar-server-list-foreground": materialColour("onBackground", 80),
      "sidebar-channels-category-foreground": materialColour(
        "onSurfaceVariant",
        60,
      ),

      // Messaging: Interface
      "messaging-channel-header-divider": materialColour("onBackground", 80),
      "messaging-indicator-background": `rgba(${hexToRgb(
        materialColour("background", 94),
      )}, 0.50)`,
      "messaging-indicator-foreground": materialColour("onBackground"),
      "messaging-indicator-reply-enabled": materialColour("primary"),
      "messaging-indicator-reply-disabled": materialColour("onBackground", 60),
      "messaging-upload-file-background": materialColour("surfaceVariant", 80),
      "messaging-upload-file-new": materialColour("surfaceVariant", 85),
      "messaging-upload-file-foreground": materialColour("onBackground", 98),
      "messaging-upload-divider": materialColour("primary", 85),
      testing: materialColour("onBackground", 88),
      "messaging-message-box-background": materialColour("onBackground", 94),
      "messaging-message-box-foreground": materialColour("onPrimaryContainer"),
      "messaging-message-mentioned-background": materialColour(
        "surfaceVariant",
        97,
      ),
      "messaging-message-info-text": materialColour("onBackground", 50),

      // Messaging: Components
      "messaging-component-container-background": materialColour(
        "background",
        95,
      ),
      "messaging-component-blocked-message-background": "transparent",
      "messaging-component-blocked-message-foreground": materialColour(
        "onBackground",
        60,
      ),
      "messaging-component-system-message-foreground": materialColour(
        "onBackground",
        40,
      ),
      "messaging-component-message-reply-hook": materialColour(
        "onBackground",
        90,
      ),
      "messaging-component-code-block-background":
        materialColour("surfaceVariant"),
      "messaging-component-code-block-foreground":
        materialColour("onSurfaceVariant"),
      "messaging-component-code-block-language-background":
        materialColour("primary"),
      "messaging-component-code-block-language-foreground":
        materialColour("onPrimary"),
      "messaging-component-blockquote-background":
        materialColour("surfaceVariant"),
      "messaging-component-blockquote-foreground":
        materialColour("onSurfaceVariant"),
      "messaging-component-text-embed-background":
        materialColour("surfaceVariant"),
      "messaging-component-text-embed-foreground":
        materialColour("onSurfaceVariant"),
      "messaging-component-attachment-background":
        materialColour("surfaceVariant"),
      "messaging-component-attachment-foreground":
        materialColour("onSurfaceVariant"),
      "messaging-component-message-divider-background": materialColour(
        "onSurfaceVariant",
        80,
      ),
      "messaging-component-message-divider-foreground": materialColour(
        "onSurfaceVariant",
        60,
      ),
      "messaging-component-message-divider-unread-background":
        materialColour("primary"),
      "messaging-component-message-divider-unread-foreground":
        materialColour("onPrimary"),
      "messaging-component-reaction-background": materialColour(
        "onBackground",
        97,
      ),
      "messaging-component-reaction-foreground": materialColour("onBackground"),
      "messaging-component-reaction-selected-background":
        materialColour("primaryContainer"),
      "messaging-component-reaction-selected-foreground":
        materialColour("onPrimaryContainer"),
      "messaging-component-mention-background":
        materialColour("surfaceVariant"),
      "messaging-component-mention-foreground":
        materialColour("onSurfaceVariant"),

      // Settings
      "settings-background": materialColour("secondary", 92),
      "settings-foreground": materialColour("onSecondaryContainer"),
      "settings-content-background": materialColour("secondary", 96),
      "settings-content-foreground": materialColour("onSecondary", 20),
      "settings-content-scroll-thumb": materialColour("secondary", 70),
      "settings-close-anchor": materialColour("primary"),
      "settings-close-anchor-hover": materialColour("onPrimary"),
      "settings-sidebar-category": materialColour("primary"),
      "settings-sidebar-foreground": materialColour("onSecondary", 20),
      "settings-sidebar-button-hover": materialColour("secondary", 90),
      "settings-sidebar-button-active": materialColour("secondary", 82),
      // Temporary Colours
      "temp-1": materialColour("secondary", 85),
    },
  } as never;
};
