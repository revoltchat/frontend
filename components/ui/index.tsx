/// <reference path="./types/styled.d.ts" />

export * from "./components";

import type { DefaultTheme } from "solid-styled-components";
export { ThemeProvider, styled } from "solid-styled-components";

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
    warning: "#FAA352",
    error: "#ED4245",
    "status-online": "#3ABF7E",
    "status-idle": "#F39F00",
    "status-focus": "#4799F0",
    "status-busy": "#F84848",
    "status-streaming": "#977EFF",
    "status-invisible": "#A5A5A5",
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
  },
  gap: {
    none: "0",
    sm: "4px",
    md: "8px",
    lg: "16px",
  },
  fonts: {
    primary: '"Open Sans", sans-serif',
  },
  transitions: {
    fast: ".1s ease-in-out",
    medium: ".2s ease",
  },
  effects: {
    blur: {
      md: "blur(20px)",
    },
    hover: "brightness(0.95)",
    spoiler: "brightness(0.2) contrast(0.8) blur(24px)",
  },
  layout: {
    height: {
      header: "48px",
      "tall-header": "120px",
      "message-box": "48px",
    },
    attachments: {
      "min-width": "240px",
      "max-width": "420px",
      "min-height": "120px",
      "max-height": "420px",
    },
  },
};
