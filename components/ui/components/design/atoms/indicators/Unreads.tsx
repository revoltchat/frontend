import { Match, Switch } from "solid-js";
import { useTheme } from "solid-styled-components";

export type Props = {
  unread: boolean;
  count: number;
};

/**
 * Overlays unreads in current SVG
 */
export function Unreads(props: Props) {
  const theme = useTheme();

  return <Switch>
    <Match when={props.count > 0}>
      <circle cx="27" cy="5" r="5" fill={theme!.colours["error"]} />
      <text
        x="27"
        y="5"
        fill={"white"}
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
      <circle cx="27" cy="5" r="5" fill={"white"} />
    </Match>
  </Switch>
}
