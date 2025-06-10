import { Accessor, JSX, Show } from "solid-js";

import { cva } from "styled-system/css";
import { styled } from "styled-system/jsx";

import { Breadcrumbs, Button, Text, iconSize } from "@revolt/ui";

import MdClose from "@material-design-icons/svg/outlined/close.svg?component-solid";

import { SettingsList } from "..";
import { useSettingsNavigation } from "../Settings";

/**
 * Content portion of the settings menu
 */
export function SettingsContent(props: {
  onClose?: () => void;
  children: JSX.Element;
  list: Accessor<SettingsList>;
  title: (ctx: SettingsList, key: string) => string;
  page: Accessor<string | undefined>;
}) {
  const { navigate } = useSettingsNavigation();

  return (
    <div
      use:scrollable={{
        class: base(),
      }}
    >
      <Show when={props.page()}>
        <InnerContent>
          <InnerColumn>
            <Text class="title" size="large">
              <Breadcrumbs
                elements={props.page()!.split("/")}
                renderElement={(key) => props.title(props.list(), key)}
                navigate={(keys) => navigate(keys.join("/"))}
              />
            </Text>
            {props.children}
          </InnerColumn>
        </InnerContent>
      </Show>
      <Show when={props.onClose}>
        <CloseAction>
          <Button size="icon" variant="plain" onPress={props.onClose}>
            <MdClose {...iconSize(28)} />
          </Button>
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
    background: "var(--md-sys-color-surface-container-low)",
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
