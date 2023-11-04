import { Match, Switch } from "solid-js";
import { useTheme } from "solid-styled-components";

export type Props = {
  unread: boolean;
  count: number;
};

/**
 * Unreads count SVG graphic
 */
export function UnreadsGraphic(props: Props) {
  const theme = useTheme();

  return (
    <Switch>
      <Match when={props.count > 0}>
        <circle cx="27" cy="5" r="5" fill={theme!.customColours.error.color} />
        <text
          x="27"
          y="5"
          fill={theme!.customColours.error.onColor}
          font-size={"7.5"}
          font-weight={600}
          text-anchor="middle"
          dominant-baseline={"middle"}
          alignment-baseline={"middle"}
        >
          {props.count < 10 ? props.count : "9+"}
        </text>
      </Match>
      <Match when={props.unread}>
        <circle cx="27" cy="5" r="5" fill={theme!.colours.foreground} />
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
