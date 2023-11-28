import { JSXElement } from "solid-js";
import { styled } from "solid-styled-components";

import { ripple } from "../../../../directives";

import { Initials } from "./Initials";

void ripple;

export type Props = {
  /**
   * Avatar size
   */
  size?: number;

  /**
   * Avatar shape
   */
  shape?: "circle" | "rounded-square";

  /**
   * Image source
   */
  src?: string;

  /**
   * Fallback if no source
   */
  fallback?: string | JSXElement;

  /**
   * If this avatar falls back, use primary contrasting colours
   */
  primaryContrast?: boolean;

  /**
   * Punch a hole through the avatar
   */
  holepunch?:
    | "bottom-right"
    | "top-right"
    | "right"
    | "overlap"
    | "overlap-subtle"
    | "none"
    | false;

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
const Image = styled("img")<Pick<Props, "shape">>`
  width: 100%;
  height: 100%;
  object-fit: cover;

  border-radius: ${(props) =>
    props.shape === "rounded-square"
      ? props.theme!.borderRadius.md
      : props.theme!.borderRadius.full};
`;

/**
 * Text fallback container
 */
const FallbackBase = styled("div")<Pick<Props, "shape" | "primaryContrast">>`
  width: 100%;
  height: 100%;

  border-radius: ${(props) =>
    props.shape === "rounded-square"
      ? props.theme!.borderRadius.md
      : props.theme!.borderRadius.full};

  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: 600;
  font-size: 0.75rem;
  color: ${(props) =>
    props.theme!.colours[
      `component-avatar-fallback${
        props.primaryContrast ? "-contrast" : ""
      }-foreground`
    ]};
  background: ${(props) =>
    props.theme!.colours[
      `component-avatar-fallback${
        props.primaryContrast ? "-contrast" : ""
      }-background`
    ]};
`;

/**
 * Avatar parent container
 */
const ParentBase = styled("svg", "Avatar")<Pick<Props, "interactive">>`
  flex-shrink: 0;
  user-select: none;
  cursor: ${(props) => (props.interactive ? "cursor" : "inherit")};

  foreignObject {
    transition: ${(props) => props.theme!.transitions.fast} filter;
  }
`;

/**
 * Generic Avatar component
 *
 * Partially inspired by Adw.Avatar API, we allow users to specify a fallback component (usually just text) to display in case the URL is invalid.
 */
export function Avatar(props: Props) {
  return (
    <ParentBase
      width={props.size}
      height={props.size}
      viewBox="0 0 32 32"
      interactive={props.interactive}
    >
      <foreignObject
        x="0"
        y="0"
        width="32"
        height="32"
        // @ts-expect-error Solid.js typing issue
        mask={
          props.holepunch ? `url(#holepunch-${props.holepunch})` : undefined
        }
      >
        {props.src && (
          <Image src={props.src} draggable={false} shape={props.shape} />
        )}
        {!props.src && (
          <FallbackBase
            use:ripple
            shape={props.shape}
            primaryContrast={props.primaryContrast}
          >
            {typeof props.fallback === "string" ? (
              <Initials input={props.fallback} maxLength={2} />
            ) : (
              props.fallback
            )}
          </FallbackBase>
        )}
      </foreignObject>
      {props.overlay}
    </ParentBase>
  );
}
