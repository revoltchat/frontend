import { type Accessor, type JSX, onCleanup } from "solid-js";

import { cva } from "styled-system/css";

const baseStyles = cva({
  base: {
    willChange: "transform",

    scrollbarColor: "var(--md-sys-color-primary) transparent",

    "&::-webkit-scrollbar": {
      width: "8px",
      height: "8px",
    },

    "&::-webkit-scrollbar-track": {
      background: "transparent",
    },

    "&::-webkit-scrollbar-thumb": {
      background: "var(--md-sys-color-primary)",
      backgroundClip: "content-box",

      border: "1px solid transparent",
      borderRadius: "var(--borderRadius-lg)",
      // TODO: border-top: ${(props?.offsetTop || 0).toString()}px solid transparent;
    },
  },
  variants: {
    direction: {
      x: {
        overflowX: "scroll",
        overflowY: "hidden",
      },
      y: {
        overflowY: "scroll",
        overflowX: "hidden",
      },
    },
    showOnHover: {
      true: {
        scrollbarWidth: "none",

        "&::-webkit-scrollbar": {
          display: "none",
        },
      },
    },
  },
  defaultVariants: {
    direction: "y",
    showOnHover: false,
  },
});

const hoverStyles = cva({
  base: {
    scrollbarWidth: "initial !important",

    "&::-webkit-scrollbar": {
      display: "unset !important",
    },
  },
});

/**
 * Add styles and events for a scrollable container
 * @param el Element
 * @param accessor Parameters
 */
export function scrollable(
  el: HTMLDivElement,
  accessor: Accessor<JSX.Directives["scrollable"] & object>,
) {
  const props = accessor();
  if (!props) return;

  if (props.offsetTop) {
    el.style.paddingTop = props.offsetTop + "px";
  }

  el.classList.add(
    ...baseStyles({
      direction: props.direction,
      showOnHover: props.showOnHover,
    }).split(" "),
  );

  if (props.class) {
    props.class.split(" ").forEach((cls) => el.classList.add(cls));
  }

  if (props.showOnHover) {
    const showClass = hoverStyles().split(" ");

    /**
     * Handle mouse entry
     */
    const onMouseEnter = () => {
      el.classList.add(...showClass);
    };

    /**
     * Handle mouse leave
     */
    const onMouseLeave = () => {
      el.classList.remove(...showClass);
    };

    el.addEventListener("mouseenter", onMouseEnter);
    el.addEventListener("mouseleave", onMouseLeave);

    onCleanup(() => {
      el.removeEventListener("mouseenter", onMouseEnter);
      el.removeEventListener("mouseleave", onMouseLeave);
    });
  }
}
