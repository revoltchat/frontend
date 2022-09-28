import { useTheme } from "solid-styled-components";

export type Props = {
  unread: boolean;
  count: number;
};

/**
 * Overlays unreads in current SVG
 */
export function Unreads({ unread, count }: Props) {
  const theme = useTheme();

  if (count > 0) {
    return (
      <>
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
          {count < 10 ? count : "9+"}
        </text>
      </>
    );
  }

  if (unread) {
    return <circle cx="27" cy="5" r="5" fill={"white"} />;
  }

  return null;
}
