import { DefaultTheme } from "solid-styled-components";

export const darkTheme: DefaultTheme = {
  colours: {
    accent: "#FD6671",
    foreground: "#FFF",
    "foreground-100": "#EEE",
    "foreground-200": "#CCC",
    "foreground-300": "#AAA",
    "foreground-400": "#848484",
    background: "#191919",
    "background-100": "#1E1E1E",
    "background-200": "#242424",
    "background-300": "#363636",
    "background-400": "#4D4D4D",
    success: "#65E572",
    "success-100": "#3f9247",
    "success-200": "#3b483b",
    warning: "#FAA352",
    error: "#ED4245",
    "error-200": "#483b3b",
    "status-online": "#3ABF7E",
    "status-idle": "#F39F00",
    "status-focus": "#4799F0",
    "status-busy": "#F84848",
    "status-streaming": "#977EFF",
    "status-invisible": "#A5A5A5",
  },
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
    sm: "4px",
    md: "8px",
    lg: "16px",
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
      colour: "foreground-100",
    },
    // Messaging specific
    messages: {
      fontSize: "14px",
      fontWeight: 300,
    },
    reply: {
      fontSize: "0.8rem",
      colour: "foreground-100",
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
      fontWeight: 600,
      fontSize: "2rem",
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
      colour: "foreground-100",
    },
    "legacy-modal-title-2": {
      element: "h4",
      margin: 0,
      fontWeight: 500,
      fontSize: "0.8125rem",
      colour: "foreground-100",
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
