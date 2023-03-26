import { useTheme } from "solid-styled-components";

import type { API } from "revolt.js";

export type Props = {
  /**
   * User we are dealing with
   */
  status: API.Presence;
};

/**
 * Overlays user status in current SVG
 */
export const UserStatusGraphic = (props: Props) => {
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

/**
 * Standalone user status element
 */
export function UserStatus(props: Props & { size: string }) {
  return (
    <svg viewBox="22 22 10 10" height={props.size}>
      <UserStatusGraphic {...props} />
    </svg>
  );
}
