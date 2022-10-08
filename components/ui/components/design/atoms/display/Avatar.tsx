import { JSXElement } from "solid-js";
import { styled } from "solid-styled-components";
import { Initials } from "./Initials";

export type Props = {
  /**
   * Avatar size
   */
  size?: number;

  /**
   * Image source
   */
  src?: string;

  /**
   * Fallback if no source
   */
  fallback?: string | JSXElement;

  /**
   * Punch a hole through the avatar
   */
  holepunch?: "bottom-right" | "top-right" | "right" | "none" | false;

  /**
   * Specify overlay component
   */
  overlay?: JSXElement;

  /**
   * Whether this icon is interactive
   */
  interactive?: boolean;
};

/**
 * Avatar image
 */
const Image = styled("img")`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;

/**
 * Text fallback container
 */
const FallbackBase = styled("div")`
  width: 100%;
  height: 100%;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: 600;
  font-size: 0.75rem;
  color: ${({ theme }) => theme!.colours["foreground"]};
  background: ${({ theme }) => theme!.colours["background-200"]};
`;

/**
 * Avatar parent container
 */
const ParentBase = styled("svg")<Pick<Props, "interactive">>`
  user-select: none;
  cursor: ${(props) => (props.interactive ? "cursor" : "inherit")};

  foreignObject {
    transition: 150ms ease filter;
  }

  &:hover foreignObject {
    filter: ${(props) => (props.interactive ? "brightness(0.8)" : "unset")};
  }
`;

/**
 * Generic Avatar component
 *
 * Partially inspired by Adw.Avatar API, we allow users to specify a fallback component (usually just text) to display in case the URL is invalid.
 */
export function Avatar({
  size,
  holepunch,
  fallback,
  src,
  overlay,
  interactive,
}: Props) {
  return (
    <ParentBase
      width={size}
      height={size}
      viewBox="0 0 32 32"
      interactive={interactive}
    >
      <foreignObject
        x="0"
        y="0"
        width="32"
        height="32"
        // @ts-expect-error Solid.js typing issue
        mask={holepunch ? `url(#holepunch-${holepunch})` : undefined}
      >
        {src && <Image src={src} />}
        {!src && (
          <FallbackBase>
            {typeof fallback === "string" ? (
              <Initials input={fallback} maxLength={2} />
            ) : (
              fallback
            )}
          </FallbackBase>
        )}
      </foreignObject>
      {overlay}
    </ParentBase>
  );
}
