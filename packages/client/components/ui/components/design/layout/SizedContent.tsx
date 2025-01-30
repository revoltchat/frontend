import { JSX } from "solid-js";
import { styled } from "styled-system/jsx";

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
const Base = styled("figure", {
  base: {
    margin: 0,

    "& > :not(.container), .Spoiler": {
      display: "block",
      objectFit: "contain",
      aspectRatio: "var(--width) / var(--height)",
      borderRadius: "var(--borderRadius-md)",
    },

    "& video": {
      minWidth: "var(--layout-attachments-min-width)",
      maxWidth: "var(--layout-attachments-max-width)",
      minHeight: "var(--layout-attachments-min-height)",
      maxHeight: "var(--layout-attachments-max-height)",
    },

    "& iframe": {
      minWidth: "var(--layout-attachments-min-width)",
      maxWidth: "var(--layout-attachments-max-width)",
      minHeight: "var(--layout-attachments-min-height)",
      maxHeight: "var(--layout-attachments-max-height)",
    },

    "& .Spoiler.Video": {
      minWidth: "var(--layout-attachments-min-width)",
      maxWidth: "var(--layout-attachments-max-width)",
      minHeight: "var(--layout-attachments-min-height)",
      maxHeight: "var(--layout-attachments-max-height)",
    },
  },
});

/**
 * Render tall content
 */
const Tall = styled(Base, {
  base: {
    "& img": {
      width: "auto",
      minHeight: "var(--layout-attachments-min-height)",
      maxHeight: "var(--layout-attachments-max-height)",
    },

    "& .Spoiler.Image": {
      width: "auto",
      minHeight: "var(--layout-attachments-min-height)",
      maxHeight: "var(--layout-attachments-max-height)",
      height: "var(--height-px)",
    },
  },
});

/**
 * Render wide content
 */
const Wide = styled(Base, {
  base: {
    "& img": {
      height: "auto",
      minWidth: "var(--layout-attachments-min-width)",
      maxWidth: "var(--layout-attachments-max-width)",
    },

    "& .Spoiler.Image": {
      height: "auto",
      minWidth: "var(--layout-attachments-min-width)",
      maxWidth: "var(--layout-attachments-max-width)",
      width: "var(--width-px)",
    },

    "& .Spoiler.Video": {
      height: "auto",
      minWidth: "var(--layout-attachments-min-width)",
      maxWidth: "var(--layout-attachments-max-width)",
    },

    "& video": {
      height: "auto",
    },
  },
});

/**
 * Automatic message content sizing for images, videos and embeds
 */
export function SizedContent(props: Props) {
  // Height and width should never update? (maybe if we add removable attachments)
  // eslint-disable-next-line solid/reactivity
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
