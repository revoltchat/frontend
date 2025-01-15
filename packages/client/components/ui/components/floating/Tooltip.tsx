import { JSX, splitProps } from "solid-js";
import { styled } from "styled-system/jsx";

/**
 * Base element for the tooltip
 */
export const TooltipBase = styled("div", {
  base: {
    color: "white",
    background: "black",
    padding: "var(--gap-md)",
    borderRadius: "var(--borderRadius-md)",
    // TODO: ...generateTypographyCSS("tooltip"),
  },
});

type Props = {
  /**
   * Tooltip trigger area
   */
  children: JSX.Element;
} & (JSX.Directives["floating"] & object)["tooltip"];

/**
 * Tooltip component
 */
export function Tooltip(props: Props) {
  const [local, remote] = splitProps(props, ["children"]);

  return (
    <div
      use:floating={{
        tooltip: remote as never,
      }}
    >
      {local.children}
    </div>
  );
}
