import { Accessor, JSX, Show } from "solid-js";

import { styled } from "styled-system/jsx";

import { Breadcrumbs, Column, iconSize, typography } from "@revolt/ui";

import MdClose from "@material-design-icons/svg/outlined/close.svg?component-solid";

import { useSettingsNavigation } from "../Settings";
import { cva } from "styled-system/css";

/**
 * Content portion of the settings menu
 */
export function SettingsContent(props: {
  onClose?: () => void;
  children: JSX.Element;
  title: (key: string) => string;
  page: Accessor<string | undefined>;
}) {
  const { navigate } = useSettingsNavigation();

  return (
    <div
      use:scrollable={{
        palette: "settings",
        class: base(),
      }}
    >
      <Show when={props.page()}>
        <InnerContent>
          <InnerColumn>
            <span class={typography({ class: "title", size: "large" })}>
              <Breadcrumbs
                elements={props.page()!.split("/")}
                renderElement={(key) => props.title(key)}
                navigate={(keys) => navigate(keys.join("/"))}
              />
            </span>
            {props.children}
          </InnerColumn>
        </InnerContent>
      </Show>
      <Show when={props.onClose}>
        <CloseAction>
          <CloseAnchor onClick={props.onClose}>
            <MdClose {...iconSize(28)} />
          </CloseAnchor>
        </CloseAction>
      </Show>
    </div>
  );
}

/**
 * Base styles
 */
const base = cva({
  base: {
    minWidth: 0,
    flex: "1 1 800px",
    flexDirection: "row",
    display: "flex",
    background: "var(--colours-settings-content-background)",
    borderStartStartRadius: "30px",
    borderEndStartRadius: "30px",

    "& > a": {
      textDecoration: "none",
    },
  },
});

/**
 * Settings pane
 */
const InnerContent = styled("div", {
  base: {
    gap: "13px",
    minWidth: 0,
    width: "100%",
    display: "flex",
    maxWidth: "740px",
    padding: "80px 32px",
    justifyContent: "stretch",
    zIndex: 1,
  },
});

/**
 * Pane content column
 */
const InnerColumn = styled("div", {
  base: {
    width: "100%",
    gap: "var(--gap-md)",
    display: "flex",
    flexDirection: "column",
  },
});

/**
 * Button for closing settings page
 */
const CloseAnchor = styled("a", {
  base: {
    width: "36px",
    height: "36px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "var(--borderRadius-full)",
    border: "3px solid var(--colours-settings-close-anchor)",
    transition: "var(--transitions-fast) background-color",
    "& svg": {
      transition: "var(--transitions-fast) background-color",
      color: "var(--colours-settings-close-anchor) !important",
    },
    "&:hover": {
      background: "var(--colours-settings-close-anchor)",
    },
    "&:hover svg": {
      color: "var(--colours-settings-close-anchor-hover) !important",
    },
    "&:active": {
      transform: "translateY(2px)",
    },
  },
});

/**
 * Positioning for close button
 */
const CloseAction = styled("div", {
  base: {
    flexGrow: 1,
    flexShrink: 0,
    padding: "80px 8px",
    visibility: "visible",
    position: "sticky",
    top: 0,
    "&:after": {
      content: '"ESC"',
      marginTop: "4px",
      display: "flex",
      justifyContent: "center",
      width: "36px",
      fontWeight: 600,
      color: "var(--colours-settings-content-foreground)",
      fontSize: "0.75rem",
    },
  },
});
