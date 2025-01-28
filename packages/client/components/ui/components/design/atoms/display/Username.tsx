import { splitProps } from "solid-js";

import { ColouredText } from "./ColouredText";
import { typography } from "./Typography";

type Props = {
  /**
   * Username
   */
  username?: string;

  /**
   * Text colour
   */
  colour?: string;
};

/**
 * Username
 */
export function Username(props: Props) {
  const [local, remote] = splitProps(props, ["username", "colour"]);

  return (
    <span {...remote} class={typography({ class: "label", size: "large" })}>
      <ColouredText
        colour={local.colour!}
        clip={local.colour?.includes("gradient")}
      >
        {local.username}
      </ColouredText>
    </span>
  );
}
