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
export const UserStatus = ({ status }: Props) => {
  const theme = useTheme();

  return (
    <circle
      cx="27"
      cy="27"
      r="5"
      fill={theme.colours[`status-${status.toLowerCase()}`]}
    />
  );
};
