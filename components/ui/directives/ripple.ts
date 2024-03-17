import { Accessor, JSX } from "solid-js";
import { css, useTheme } from "solid-styled-components";

/**
 * Add styles and events for ripple
 * @param el Element
 * @param accessor Parameters
 */
export function ripple(
  el: HTMLDivElement,
  accessor: Accessor<JSX.Directives["ripple"] & object>
) {
  const theme = useTheme();
  const props = accessor();

  // FIXME: there is a bug here if theme is changed, this class just disappears

  el.classList.add(
    css`
      overflow: hidden;
      position: relative;

      * {
        z-index: 1;
      }

      &::before {
        content: " ";
        position: absolute;
        width: 100%;
        height: 100%;

        opacity: 0;
        z-index: 0;
        transform: scale(2);
        pointer-events: none;
        background: ${theme.darkMode ? "white" : "black"};

        transition: ${theme.transitions.fast};
      }

      &:hover::before {
        opacity: ${theme.effects.ripple.hover.toString()};
      }
    `
  );

  if (typeof props === "boolean" || props.enable)
    el.classList.add(css`
      &::after {
        content: " ";
        position: absolute;
        width: 100%;
        aspect-ratio: 1;

        z-index: 0;
        border-radius: 50%;
        transform: scale(0);
        pointer-events: none;
        background: ${theme.darkMode ? "white" : "black"};
        opacity: ${theme.effects.ripple.hover.toString()};

        transition: ${theme.transitions.medium};
      }

      &:active::after {
        transform: scale(8);
      }
    `);
}
