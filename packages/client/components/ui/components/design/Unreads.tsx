import { Match, Switch } from "solid-js";

import { styled } from "styled-system/jsx";

export type Props = {
  unread: boolean;
  count: number;
};

/**
 * Styles for the counter
 */
const UnreadCounter = styled("div", {
  base: {
    width: "10px",
    height: "10px",
    marginTop: "-1px",
    textAlign: "center",

    fontSize: "8px",
    fontWeight: 600,

    color: "var(--customColours-error-onColor)",
  },
});

/**
 * Unreads count SVG graphic
 */
function UnreadsGraphic(props: Props) {
  return (
    <Switch>
      <Match when={props.count > 0}>
        <circle cx="27" cy="5" r="5" fill="var(--customColours-error-color)" />
        <foreignObject x="22" y="0" width="10" height="10">
          <UnreadCounter>{props.count < 10 ? props.count : "9+"}</UnreadCounter>
        </foreignObject>
      </Match>
      <Match when={props.unread}>
        <circle cx="27" cy="5" r="5" fill="var(--colours-foreground)" />
      </Match>
    </Switch>
  );
}

/**
 * Standalone unreads count element
 */
export function Unreads(props: Props & { size: string }) {
  return (
    <svg viewBox="22 0 10 10" height={props.size}>
      <UnreadsGraphic {...props} />
    </svg>
  );
}

Unreads.Graphic = UnreadsGraphic;
