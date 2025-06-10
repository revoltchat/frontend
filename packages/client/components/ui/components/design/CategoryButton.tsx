import { For, JSX, Match, Show, Switch } from "solid-js";
import { splitProps } from "solid-js";
import { createSignal } from "solid-js";
import { ComponentProps } from "solid-js";

import { cva } from "styled-system/css";
import { styled } from "styled-system/jsx";

import MdChevronRight from "@material-design-icons/svg/outlined/chevron_right.svg?component-solid";
import MdContentCopy from "@material-design-icons/svg/outlined/content_copy.svg?component-solid";
import MdKeyboardDown from "@material-design-icons/svg/outlined/keyboard_arrow_down.svg?component-solid";
import MdOpenInNew from "@material-design-icons/svg/outlined/open_in_new.svg?component-solid";

import { OverflowingText, iconSize } from "../utils";

import { Ripple } from "./Ripple";
import { typography } from "./Text";

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

  readonly roundedIcon?: boolean;
}

/**
 * Category Button
 *
 * @specification none
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
        <IconWrapper rounded={props.roundedIcon}>{props.icon}</IconWrapper>
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

    color: "var(--md-sys-color-on-primary)",
    background: "var(--md-sys-color-primary)",

    userSelect: "none",
    cursor: "pointer",
    transition: "background-color 0.1s ease-in-out",

    display: "flex",
    alignItems: "center",
    flexDirection: "row",
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
    fill: "var(--md-sys-color-on-surface)",
    background: "var(--md-sys-color-surface-dim)",

    width: "36px",
    height: "36px",
    display: "flex",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  variants: {
    rounded: {
      true: {
        borderRadius: "var(--borderRadius-full)",
      },
      false: {
        borderRadius: "var(--borderRadius-md)",
      },
    },
  },
  defaultVariants: {
    rounded: true,
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
    ...typography.raw({ class: "label" }),

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

/**
 * Group a set of category buttons
 */
export const CategoryButtonGroup = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--gap-xs)",

    borderRadius: "var(--borderRadius-xl)",
    overflow: "hidden",
  },
});

CategoryButton.Group = CategoryButtonGroup;

type CollapseProps = Omit<
  ComponentProps<typeof CategoryButton>,
  "onClick" | "children"
> & {
  children?: JSX.Element;
  title?: JSX.Element;

  scrollable?: boolean;
};

/**
 * Category button with collapsed children
 */
export function CategoryCollapse(props: CollapseProps) {
  const [local, remote] = splitProps(props, ["action", "children"]);

  const [opened, setOpened] = createSignal(false);

  let details: HTMLDivElement | undefined;
  let column: HTMLDivElement | undefined;

  /**
   * Toggle the opened state and scroll to the beginning of contents
   */
  const toggleOpened = () => {
    const openedState = opened();

    if (!openedState) {
      column?.scroll({ top: 0 });
    }

    setOpened(!openedState);
  };

  /**
   * Recalculate the column height for transition
   */
  const updatedHeight = () => {
    const calculatedHeight = opened()
      ? Math.min(column?.scrollHeight || 0, 340)
      : 0;

    return `${calculatedHeight}px`;
  };

  return (
    <Details
      ref={details!}
      onClick={toggleOpened}
      class={opened() ? "open" : undefined}
    >
      <summary>
        <CategoryButton
          {...remote}
          action={[local.action, "collapse"].flat()}
          onClick={() => void 0}
        >
          {props.title}
        </CategoryButton>
      </summary>
      <Switch
        fallback={
          <div
            class={innerColumn({ static: true })}
            ref={column!}
            style={{ height: updatedHeight() }}
          >
            {props.children}
          </div>
        }
      >
        <Match when={props.scrollable}>
          <div
            ref={column!}
            style={{ height: updatedHeight() }}
            use:scrollable={{ class: innerColumn() }}
          >
            {props.children}
          </div>
        </Match>
      </Switch>
    </Details>
  );
}

CategoryButton.Collapse = CategoryCollapse;

/**
 * Column with inner content
 */
const innerColumn = cva({
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--gap-xs)",

    borderRadius: "var(--borderRadius-md)",
    transition: "0.3s",

    scrollbarWidth: "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  variants: {
    static: {
      true: {
        overflow: "hidden",
      },
    },
  },
});

/**
 * Parent base component
 */
const Details = styled("div", {
  base: {
    "&:not(.open) .InnerColumn": {
      opacity: 0,
      pointerEvents: "none",
    },

    /* add transition to the icon */
    "& summary div:last-child svg": {
      transition: "0.3s",
    },

    /* rotate chevron when it is open */
    "&.open summary div:last-child svg": {
      transform: "rotate(180deg)",
    },

    /* add additional padding between top button and children when it is open */
    "&.open summary": {
      marginBottom: "var(--gap-xs)",
    },

    /* hide the default details component marker */
    "& summary": {
      transition: "0.3s",
      listStyle: "none",
    },

    "& summary::marker, summary::-webkit-details-marker": {
      display: "none",
    },

    /* connect elements vertically */
    "& > :not(summary) .CategoryButton": {
      /* and set child backgrounds */
      background: "var(--colours-component-categorybtn-background-collapse)",
    },
  },
});
