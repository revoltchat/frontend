import { css, useTheme } from "solid-styled-components";

/**
 *
 * @param el
 * @param param1
 */
export function scrollable(
  el: HTMLDivElement,
  props?: { direction?: "x" | "y"; offsetTop: number }
) {
  const theme = useTheme();

  el.classList.add(css`
    will-change: transform;
    padding-top: ${(props?.offsetTop || 0).toString()}px;
    ${"overflow-" + (props?.direction ?? "y")}: scroll;

    scrollbar-width: thin;
    scrollbar-color: ${theme!.colours["background-400"]} transparent;

    &::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: ${theme!.colours["background-400"]};
      background-clip: content-box;

      border: 1px solid transparent;
      border-radius: ${theme!.borderRadius.lg};
      border-top: ${(props?.offsetTop || 0).toString()}px solid transparent;
    }
  `);
}

/**
 *
 * @param el
 * @param param1
 */
export function invisibleScrollable(
  el: HTMLDivElement,
  { direction }: { direction?: "x" | "y" }
) {
  el.classList.add(css`
    will-change: transform;
    ${"overflow-" + (direction ?? "y")}: scroll;

    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  `);
}
