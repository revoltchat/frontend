import { BiRegularPlus, BiRegularXCircle, BiSolidFile } from "solid-icons/bi";
import { For, Match, Show, Switch } from "solid-js";
import { styled } from "styled-system/jsx";

import { CONFIGURATION } from "@revolt/common";
import { hoverStyles } from "@revolt/ui/directives";

import { ALLOWED_IMAGE_TYPES } from "../../../../state/stores/Draft";
import { OverflowingText } from "../../design";
import { typography } from "../../design/atoms/display/Typography";
import { cva } from "styled-system/css";

interface Props {
  /**
   * Files to display in carousel
   */
  files: string[];

  /**
   * Get file by ID
   * @param fileId ID
   */
  getFile(fileId: string): {
    file: File;
    dataUri: string | undefined;
  };

  /**
   * Invoke file picker to add file
   */
  addFile(): void;

  /**
   * Remove file by ID
   * @param fileId ID
   */
  removeFile(fileId: string): void;
}

/**
 * Determine file size
 * @param size Bytes
 * @returns Human-readable size
 */
export function determineFileSize(size: number) {
  if (size > 1e6) {
    return `${(size / 1e6).toFixed(2)} MB`;
  } else if (size > 1e3) {
    return `${(size / 1e3).toFixed(2)} KB`;
  }

  return `${size} B`;
}

/**
 * File carousel
 */
export function FileCarousel(props: Props) {
  return (
    <Show when={props.files.length}>
      <Container>
        <div class={carousel()} use:scrollable={{ direction: "x" }}>
          <For each={props.files}>
            {(id, index) => {
              /**
               * Get the actual file
               */
              const file = () => props.getFile(id);

              /**
               * Handler for removing the file
               */
              const onClick = () => props.removeFile(id);

              return (
                <>
                  <Show when={index() === CONFIGURATION.MAX_ATTACHMENTS}>
                    <Divider />
                  </Show>

                  <Entry ignored={index() >= CONFIGURATION.MAX_ATTACHMENTS}>
                    <PreviewBox
                      onClick={onClick}
                      image={ALLOWED_IMAGE_TYPES.includes(file().file.type)}
                    >
                      <Switch
                        fallback={
                          <EmptyEntry>
                            <BiSolidFile size={36} />
                          </EmptyEntry>
                        }
                      >
                        <Match
                          when={ALLOWED_IMAGE_TYPES.includes(file().file.type)}
                        >
                          <Image
                            src={file().dataUri}
                            alt={file().file.name}
                            loading="eager"
                          />
                        </Match>
                      </Switch>
                      <Overlay>
                        <BiRegularXCircle size={36} />
                      </Overlay>
                    </PreviewBox>
                    <FileName>
                      <OverflowingText>{file().file.name}</OverflowingText>
                    </FileName>
                    <Size>{determineFileSize(file().file.size)}</Size>
                  </Entry>
                </>
              );
            }}
          </For>
          <EmptyEntry
            onClick={props.addFile}
            class={hoverStyles({ ripple: true })}
          >
            <BiRegularPlus size={48} />
          </EmptyEntry>
        </div>
      </Container>
    </Show>
  );
}

/**
 * Image preview container
 */
const PreviewBox = styled("div", {
  base: {
    display: "grid",
    justifyItems: "center",
    gridTemplate: `"main" var(--layout-height-attachment-preview) / minmax(var(--layout-height-attachment-preview), 1fr)`,

    cursor: "pointer",
    overflow: "hidden",
    borderRadius: "var(--gap-md)",

    background: "var(--colours-messaging-upload-file-background)",
    color: "var(--colours-messaging-upload-file-foreground)",

    "& > *": {
      gridArea: "main",
    },
  },
  variants: {
    image: {
      true: {},
    },
  },
});

/**
 * Image preview
 */
const Image = styled("img", {
  base: {
    width: "100%",
    objectFit: "cover",
    marginBottom: "var(--gap-md)",
    height: "var(--layout-height-attachment-preview)",
  },
});

/**
 * Overlay container
 */
const Overlay = styled("div", {
  base: {
    display: "grid",
    alignItems: "center",
    justifyContent: "center",

    width: "100%",
    height: "100%",

    opacity: 0,
    color: "white",
    background: "rgba(0, 0, 0, 0.8)",
    transition: "var(--transitions-fast) opacity",

    "&:hover": {
      opacity: 1,
    },
  },
});

/**
 * Empty entry container
 */
const EmptyEntry = styled("div", {
  base: {
    display: "grid",
    flexShrink: 0,
    placeItems: "center",
    width: "var(--layout-height-attachment-preview)",
    height: "var(--layout-height-attachment-preview)",

    cursor: "pointer",
    borderRadius: "var(--gap-md)",
    background: "var(--colours-messaging-upload-file-new)",
  },
});

/**
 * Carousel entry container
 */
const Entry = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    opacity: 1,
  },
  variants: {
    ignored: {
      true: {
        opacity: 0.4,
      },
    },
  },
});

/**
 * File name information
 */
const FileName = styled("span", {
  base: {
    maxWidth: "var(--layout-height-attachment-preview)",
    textAlign: "center",

    ...typography.raw({ class: "label" }),
  },
});

/**
 * File size information
 */
const Size = styled("span", {
  base: {
    ...typography.raw({ class: "label", size: "small" }),
  },
});

/**
 * Divider between files to be uploaded and files for next upload
 */
const Divider = styled("div", {
  base: {
    height: "130px",
    flexShrink: 0,
    width: "var(--gap-sm)",
    borderRadius: "var(--borderRadius-md)",
    background: "var(--colours-messaging-upload-divider)",
  },
});

/**
 * Inner carousel container
 */
const carousel = cva({
  base: {
    display: "flex",
    flexShrink: 0,
    flexDirection: "row",
    overflowX: "auto !important",
    gap: "var(--gap-md)",
  },
});

/**
 * Outer carousel container
 */
const Container = styled("div", {
  base: {
    display: "flex",
    userSelect: "none",
    flexDirection: "column",

    gap: "var(--gap-md)",
    padding: "var(--gap-md)",
    margin: "var(--gap-md) 0",
    borderRadius: "var(--borderRadius-lg)",

    background: "var(--colours-messaging-message-box-background)",
    color: "var(--colours-messaging-message-box-foreground)",
  },
});
