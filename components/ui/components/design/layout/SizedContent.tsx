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
  .Spoiler {
    object-fit: contain;
    aspect-ratio: var(--width) / var(--height);
    border-radius: ${(props) => props.theme!.borderRadius.md};
  }

  video,
  .Spoiler.Video {
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
  .Spoiler.Image {
    width: auto;
    min-height: 120px;
    max-height: 420px;
  }

  .Spoiler.Image {
    height: var(--height-px);
  }
`;

/**
 * Render wide content
 */
const Wide = styled(Base)`
  img,
  .Spoiler.Image {
    height: auto;
    min-width: 240px;
    max-width: 420px;
  }

  .Spoiler.Image,
  .Spoiler.Video {
    width: var(--width-px);
  }

  video,
  .Spoiler.Video {
    height: auto;
  }
`;

/**
 * Automatic message content sizing for images, videos and embeds
 */
export function SizedContent(props: Props) {
  const Base = props.height > props.width ? Tall : Wide;
  return (
    <Base
      style={{
        "--width": props.width,
        "--height": props.height,
        "--width-px": props.width + "px",
        "--height-px": props.height + "px",
      }}
    >
      {props.children}
    </Base>
  );
}
