import {
  ComponentProps,
  JSX,
  Match,
  Switch,
  createSignal,
  splitProps,
} from "solid-js";
import { styled } from "styled-system/jsx";

import { Column } from "../../layout";

import { CategoryButton } from "./CategoryButton";
import { cva } from "styled-system/css";

type Props = Omit<
  ComponentProps<typeof CategoryButton>,
  "onClick" | "children"
> & {
  children?: JSX.Element;
  title?: JSX.Element;

  scrollable?: boolean;
};

/**
 * Category button with collapsed children (Fluent)
 */
export function CategoryCollapse(props: Props) {
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
