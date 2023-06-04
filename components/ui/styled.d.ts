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
        | `success-${100 | 200}`
        | "warning"
        | "error"
        | `error-${200}`
        | `status-${
            | "online"
            | "idle"
            | "focus"
            | "busy"
            | "streaming"
            | "invisible"}`]: string;
    };
    rgb: {
      [key in "header" | "typing-indicator"]: string;
    };
    breakpoints: {
      [key in "sm" | "md" | "lg" | "xl"]: string;
    };
    borderRadius: {
      [key in "sm" | "md" | "lg" | "xl" | "xxl" | "full"]: string;
    };
    gap: {
      [key in
        | "none"
        | "xxs"
        | "xs"
        | "sm"
        | "md"
        | "lg"
        | "xl"
        | "xxl"]: string;
    };
    fonts: {
      [key in "primary" | "monospace"]: string;
    };
    typography: {
      [key in
        | "label"
        | "username"
        | "status"
        | "tooltip"
        | "category"
        | "menu-button"
        | "messages"
        | "reply"
        | "composition-file-upload-name"
        | "composition-file-upload-size"
        | "composition-typing-indicator"
        | "conversation-channel-name"
        | "conversation-start"
        | "jump-to-bottom"
        | "system-message"
        | "sidebar-title"
        | "channel-topic"
        | "settings-title"
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
        element?: "h1" | "h2" | "h3" | "h4" | "h5" | "span" | "div" | "label";
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
      muted: string;
      hover: string;
      active: string;
      spoiler: string;
    };
    layout: {
      width: {
        [key in "channel-sidebar"]: string;
      };
      height: {
        [key in
          | "header"
          | "tall-header"
          | "message-box"
          | "attachment-preview"]: string;
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
