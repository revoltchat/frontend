import type { API } from "revolt.js";
import { useTheme } from "solid-styled-components";

export type Props = {
  /**
   * User we are dealing with
   */
  status: API.Presence;
};

/**
 * Overlays user status in current SVG
 */
export const UserStatus = (props: Props) => {
  const theme = useTheme();
  const statusLowercase = () => props.status.toLowerCase();

  return (
    <circle
      cx="27"
      cy="27"
      r="5"
      fill={
        theme.colours[
          `status-${statusLowercase()}` as keyof typeof theme.colours
        ]
      }
    />
  );
};
