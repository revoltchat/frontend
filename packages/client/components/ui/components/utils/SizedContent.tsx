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
 * Automatic message content sizing for images, videos and embeds
 */
export function SizedContent(props: Props) {
  return <Container style={{
    "--width": props.width,
    "--height": props.height
  }}>{props.children}</Container>;
}

const Container = styled('div', {
  base: {
    display: 'grid',
    // min. render size or chat width, whichever is smaller
    minWidth: "calc(min(100%, var(--layout-attachments-min-width)))",
    // max. render size or chat width, whichever is smaller
    maxWidth: "calc(min(100%, var(--layout-attachments-max-width)))",
    // min. render size, whichever is smaller
    minHeight: "calc(var(--layout-attachments-min-height)))",
    // max. render size
    maxHeight: "calc(min(70vh, var(--layout-attachments-max-height)))",
    aspectRatio: "var(--width)/var(--height)",

    overflow: 'hidden',
    borderRadius: 'var(--borderRadius-md)',

    // scale to size of container
    "& > *": {
      gridArea: '1/1'
    },
    "& img": {
      width: "100%"
    },
    "& .Spoiler": {
      width: "100%",
      height: "100%"
    }
  }
});
