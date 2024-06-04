import { Accessor, JSX, onCleanup } from "solid-js";
import { css, useTheme } from "solid-styled-components";

/**
 * Add styles for an invisible scrollable container
 * @param el Element
 * @param accessor Parameters
 */
export function invisibleScrollable(
  el: HTMLDivElement,
  accessor: Accessor<JSX.Directives["invisibleScrollable"] & object>
) {
  const props = accessor();

  el.classList.add(css`
    will-change: transform;
    ${"overflow-" + (props?.direction ?? "y")}: scroll;

    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  `);
}
