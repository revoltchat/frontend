import "solid-styled-components";

/**
 * Declare our custom theme options
 */
declare module "solid-styled-components" {
  export interface DefaultTheme {
    colours: {
      [key in
        | "accent"
        | "foreground"
        | `foreground-${100 | 200 | 300 | 400}`
        | "background"
        | `background-${100 | 200 | 300 | 400}`
        | "success"
        | "warning"
        | "error"
        | `status-${
            | "online"
            | "idle"
            | "focus"
            | "busy"
            | "streaming"
            | "invisible"}`]: string;
    };
    rgb: {
      [key in "channel-header"]: string;
    };
    breakpoints: {
      [key in "sm" | "md" | "lg" | "xl"]: string;
    };
    borderRadius: {
      [key in "sm" | "md" | "lg"]: string;
    };
    gap: {
      [key in "none" | "sm" | "md" | "lg"]: string;
    };
    fonts: {
      [key in "primary"]: string;
    };
    typography: {
      [key in
        | "label"
        | "username"
        | "tooltip"
        | "category"
        | "menu-button"
        | "reply"
        | "legacy-settings-title"
        | "small"
        | "legacy-modal-title"
        | "legacy-settings-section-title"
        | "legacy-modal-title-2"
        | "legacy-settings-description"]: {
        [key in
          | "margin"
          | "fontWeight"
          | "fontSize"
          | "lineHeight"
          | "textTransform"]?: number | string;
      } & {
        element?: "h1" | "h2" | "h3" | "h4" | "h5" | "span" | "label";
        colour?: keyof DefaultTheme["colours"];
      };
    };
    transitions: {
      [key in "fast" | "medium"]: string;
    };
    effects: {
      blur: {
        [key in "md"]: string;
      };
      hover: string;
      spoiler: string;
    };
    layout: {
      height: {
        [key in "header" | "tall-header" | "message-box"]: string;
      };
      attachments: {
        [key in `${"min" | "max"}-${"width" | "height"}`]: string;
      };
      emoji: {
        [key in "small" | "medium" | "large"]: string;
      };
    };
  }
}
