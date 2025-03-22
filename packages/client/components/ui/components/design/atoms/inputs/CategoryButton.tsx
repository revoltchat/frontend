import { For, JSX, Match, Show, Switch } from "solid-js";
import { styled } from "styled-system/jsx";

import { Ripple, iconSize } from "@revolt/ui";

import MdChevronRight from "@material-design-icons/svg/outlined/chevron_right.svg?component-solid";
import MdContentCopy from "@material-design-icons/svg/outlined/content_copy.svg?component-solid";
import MdKeyboardDown from "@material-design-icons/svg/outlined/keyboard_arrow_down.svg?component-solid";
import MdOpenInNew from "@material-design-icons/svg/outlined/open_in_new.svg?component-solid";

import { Column, OverflowingText } from "../../layout";

/**
 * Permissible actions
 */
type Action =
  | "chevron"
  | "collapse"
  | "external"
  | "edit"
  | "copy"
  | JSX.Element;

export interface Props {
  readonly icon?: JSX.Element | "blank";
  readonly children?: JSX.Element;
  readonly description?: JSX.Element;

  readonly disabled?: boolean;
  readonly onClick?: () => void;
  readonly action?: Action | Action[];
}

/**
 * Category Button (Fluent)
 */
export function CategoryButton(props: Props) {
  return (
    <Base
      isLink={!!props.onClick}
      disabled={props.disabled}
      aria-disabled={props.disabled}
      onClick={props.disabled ? undefined : props.onClick}
    >
      <Ripple />

      <Show when={props.icon !== "blank"}>
        <IconWrapper>{props.icon}</IconWrapper>
      </Show>

      <Show when={props.icon === "blank"}>
        <BlankIconWrapper />
      </Show>

      <Content>
        <Show when={props.children}>
          <OverflowingText>{props.children}</OverflowingText>
        </Show>
        <Show when={props.description}>
          <Description>{props.description}</Description>
        </Show>
      </Content>
      <For each={Array.isArray(props.action) ? props.action : [props.action]}>
        {(action) => (
          <Switch fallback={action}>
            <Match when={action === "chevron"}>
              <Action>
                <MdChevronRight {...iconSize(18)} />
              </Action>
            </Match>
            <Match when={action === "collapse"}>
              <Action>
                <MdKeyboardDown {...iconSize(18)} />
              </Action>
            </Match>
            <Match when={action === "external"}>
              <Action>
                <MdOpenInNew {...iconSize(18)} />
              </Action>
            </Match>
            <Match when={action === "copy"}>
              <Action>
                <MdContentCopy {...iconSize(18)} />
              </Action>
            </Match>
          </Switch>
        )}
      </For>
    </Base>
  );
}

/**
 * Base container for button
 */
const Base = styled("a", {
  base: {
    // for <Ripple />:
    position: "relative",

    gap: "16px",
    padding: "13px",
    borderRadius: "var(--borderRadius-md)",

    color: "var(--colours-component-categorybtn-foreground)",
    background: "var(--colours-component-categorybtn-background)",

    userSelect: "none",
    cursor: "pointer",
    transition: "background-color 0.1s ease-in-out",

    display: "flex",
    alignItems: "center",
    flexDirection: "row",

    "&:hover": {
      backgroundColor: "var(--colours-component-categorybtn-background-hover)",
    },

    "&:active": {
      backgroundColor: "var(--colours-component-categorybtn-background-active)",
    },
  },
  variants: {
    isLink: {
      true: {
        cursor: "pointer",
      },
      false: {
        cursor: "initial",
      },
    },
    disabled: {
      true: {
        cursor: "not-allowed",
      },
    },
  },
});

/**
 * Title and description styles
 */
const Content = styled("div", {
  base: {
    display: "flex",
    flexGrow: 1,
    flexDirection: "column",

    fontWeight: 500,
    fontSize: "14px",
    gap: "2px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
});

/**
 * Accented wrapper for the category button icons
 */
const IconWrapper = styled("div", {
  base: {
    background: "var(--colours-component-categorybtn-background-icon)",

    width: "36px",
    height: "36px",
    display: "flex",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",

    "& svg": {
      color: "var(--colours-component-categorybtn-foreground-description)",
    },
  },
});

/**
 * Category button icon wrapper for the blank state
 */
const BlankIconWrapper = styled(IconWrapper, {
  base: {
    background: "transparent",
  },
});

/**
 * Description shown below title
 */
const Description = styled("span", {
  base: {
    fontWeight: 500,
    fontSize: "12px",
    color: "var(--colours-component-categorybtn-foreground-description)",
    textWrap: "wrap",

    "& a:hover": {
      textDecoration: "underline",
    },
  },
});

/**
 * Container for action icons
 */
const Action = styled("div", {
  base: {
    width: "24px",
    height: "24px",
    flexShrink: 0,

    display: "grid",
    placeItems: "center",
  },
});
