import { JSX, createMemo } from "solid-js";

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

const MIN_W = 160;
const MIN_H = 120;
const MAX_S = 420;

/**
 * Automatic message content sizing for images, videos and embeds
 */
export function SizedContent(props: Props) {
  // const tall = () => props.width > props.height;

  // const desiredWidth = "max(var(--width), var(--layout-attachments-min-width))";
  // const desiredHeight =
  //   "max(var(--height), var(--layout-attachments-min-height))";

  // const constrainedWidth = `calc(min(${desiredWidth}, (var(--width)/var(--height)) * min(${desiredHeight}, var(--layout-attachments-max-height))))`;
  // const constrainedHeight = `calc(min(${desiredHeight}, (var(--height)/var(--width)) * min(${desiredWidth}, var(--layout-attachments-max-width))))`;

  const size = createMemo(() => {
    let width = props.width,
      height = props.height;

    // console.info("1", width, height);

    // ensure min. size
    if (width < MIN_W) {
      height *= MIN_W / width;
      width = MIN_W;
    }
    // console.info("2", width, height);

    if (height < MIN_H) {
      width *= MIN_H / height;
      height = MIN_H;
    }
    // console.info("3", width, height);

    // scale down to required size
    if (width > MAX_S) {
      height /= width / MAX_S;
      width = MAX_S;
    }
    // console.info("4", width, height);

    if (height > MAX_S) {
      width /= height / MAX_S;
      height = MAX_S;
    }
    // console.info("5", width, height);

    return {
      width,
      height,
    };
  });

  return (
    <Container
      style={{
        width: size().width + "px",
        // height: size().height + "px",
        "aspect-ratio": `${size().width} / ${size().height}`,
      }}
    >
      {props.children}
    </Container>
  );
}

const Container = styled("div", {
  base: {
    display: "grid",

    height: "auto",
    maxWidth: "100%",

    // // min. render size or chat width, whichever is smaller
    // // minWidth: "calc(min(100%, var(--layout-attachments-min-width)))",
    // minWidth: "var(--layout-attachments-min-width)",
    // // max. render size or chat width, whichever is smaller
    // // maxWidth: "calc(min(100%, var(--layout-attachments-max-width)))",
    // maxWidth: "var(--layout-attachments-max-width)",
    // // min. render size, whichever is smaller
    // minHeight: "var(--layout-attachments-min-height)",
    // // max. render size
    // maxHeight: "calc(min(70vh, var(--layout-attachments-max-height)))",

    // width: "auto",
    // height: "var(--height)",
    // aspectRatio: "var(--width) / var(--height)",

    overflow: "hidden",
    borderRadius: "var(--borderRadius-md)",

    gridTemplateColumns: "1fr",
    gridTemplateRows: "1fr",

    // scale to size of container
    "& > *": {
      // gridArea: "1/1",
      // top-left corner to bottom-right corner
      gridArea: "1 / 1 / 2 / 2",
      width: "100%",
      height: "100%",

      // special case for images
      minHeight: 0,

      // testing:
      objectFit: "contain",
    },
    // "& .Spoiler": {
    //   width: "100%",
    //   height: "100%",
    // },
  },
  // variants: {
  //   tall: {
  //     true: {
  //       // // special case for image sizing:
  //       // "& img": {
  //       //   width: "unset",
  //       // },
  //     },
  //   },
  // },
});
