import { JSX } from "solid-js";
import { styled } from "solid-styled-components";

interface Props {
  /**
   * Pixel width of the content
   */
  width: number;

  /**
   * Pixel height of the content
   */
  height: number;

  /**
   * The content itself
   */
  children: JSX.Element;
}

/**
 * Sized content base container
 */
const Base = styled("figure")`
  margin: 0;

  > :not(.container),
  .spoiler {
    object-fit: contain;
    aspect-ratio: var(--width) / var(--height);
    border-radius: ${(props) => props.theme!.borderRadius.md};
  }

  video,
  .spoiler.Video {
    min-width: 240px;
    max-width: 420px;

    min-height: 120px;
    max-height: 420px;
  }
`;

/**
 * Render tall content
 */
const Tall = styled(Base)`
  img,
  .spoiler.Image {
    width: auto;
    min-height: 120px;
    max-height: 420px;
  }
`;

/**
 * Render wide content
 */
const Wide = styled(Base)`
  img,
  .spoiler.Image {
    height: auto;
    min-width: 240px;
    max-width: 420px;
  }

  video,
  .spoiler.Video {
    height: auto;
  }
`;

/**
 * Automatic message content sizing for images, videos and embeds
 */
export function SizedContent({ width, height, children }: Props) {
  const Base = height > width ? Tall : Wide;
  return (
    <Base
      style={{
        "--width": width,
        "--height": height,
        "--width-px": width + "px",
        "--height-px": height + "px",
      }}
    >
      {children}
    </Base>
  );
}
