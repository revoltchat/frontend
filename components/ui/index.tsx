export * from "./components/design/atoms/inputs";

export { Masks } from "./components/common/Masks";
export { Avatar } from "./components/design/atoms/display/Avatar";
export { Typography } from "./components/design/atoms/display/Typography";
export { UserStatus } from "./components/design/atoms/indicators/UserStatus";
export { FormGroup } from "./components/design/atoms/display/FormGroup";

export * from "./components/design/atoms/indicators";

export * from "./components/design/layout";
export * from "./components/poppers/Tooltip";

export { ServerList } from "./components/navigation/servers/ServerList";
export { ServerSidebar } from "./components/navigation/channels/ServerSidebar";

import type { DefaultTheme } from "solid-styled-components";
export { ThemeProvider } from "solid-styled-components";

export const darkTheme: DefaultTheme = {
  colours: {
    accent: "#FD6671",
    foreground: "#FFF",
    "foreground-100": "#EEE",
    "foreground-200": "#CCC",
    "foreground-300": "#AAA",
    "foreground-400": "#848484",
    background: "#000",
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
    md: "6px",
    lg: "12px",
  },
  gap: {
    sm: "4px",
    md: "8px",
    lg: "16px",
  },
};
