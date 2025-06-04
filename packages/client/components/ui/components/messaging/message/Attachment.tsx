import { Match, Show, Switch } from "solid-js";

import { File, ImageEmbed, VideoEmbed } from "revolt.js";
import { css } from "styled-system/css";
import { styled } from "styled-system/jsx";

import { useModals } from "@revolt/modal";

import { Column } from "../../design/layout";
import { SizedContent } from "../../design/layout/SizedContent";
import { Spoiler } from "../../design/layout/Spoiler";

import { FileInfo } from "./FileInfo";
import { TextFile } from "./TextFile";

/**
 * List of attachments
 */
export const AttachmentContainer = styled(Column, {
  base: {
    padding: "var(--gap-md)",
    borderRadius: "var(--borderRadius-md)",
    color: "var(--colours-messaging-component-attachment-foreground)",
    background: "var(--colours-messaging-component-attachment-background)",
  },
});

/**
 * Print human-readable file size
 */
export function humanFileSize(size: number) {
  if (size > 1e6) {
    return `${(size / 1e6).toFixed(2)} MB`;
  } else if (size > 1e3) {
    return `${(size / 1e3).toFixed(2)} KB`;
  }

  return `${size} B`;
}

/**
 * Render a given list of files
 */
export function Attachment(props: { file: File }) {
  const { openModal } = useModals();

  return (
    <Switch fallback={`Could not render ${props.file.metadata.type}!`}>
      <Match when={props.file.metadata.type === "Image"}>
        <SizedContent
          width={(props.file.metadata as ImageEmbed).width}
          height={(props.file.metadata as ImageEmbed).height}
        >
          <Show when={props.file.isSpoiler}>
            <Spoiler contentType="Image" />
          </Show>
          <img
            class={css({ cursor: "pointer" })}
            onClick={() =>
              openModal({
                type: "image_viewer",
                file: props.file,
              })
            }
            loading="lazy"
            src={props.file.createFileURL()}
          />
        </SizedContent>
      </Match>
      <Match when={props.file.metadata.type === "Video"}>
        <SizedContent
          width={(props.file.metadata as VideoEmbed).width}
          height={(props.file.metadata as VideoEmbed).height}
        >
          <Show when={props.file.isSpoiler}>
            <Spoiler contentType="Video" />
          </Show>
          <video controls preload="metadata" src={props.file.url} />
        </SizedContent>
      </Match>
      <Match when={props.file.metadata.type === "Audio"}>
        <AttachmentContainer>
          <FileInfo file={props.file} />
          <SizedContent width={360} height={48}>
            <audio controls src={props.file.url} />
          </SizedContent>
        </AttachmentContainer>
      </Match>
      <Match when={props.file.metadata.type === "File"}>
        <AttachmentContainer>
          <FileInfo file={props.file} />
        </AttachmentContainer>
      </Match>
      <Match when={props.file.metadata.type === "Text"}>
        <AttachmentContainer>
          <FileInfo file={props.file} />
          <SizedContent width={480} height={120}>
            <TextFile file={props.file} />
          </SizedContent>
        </AttachmentContainer>
      </Match>
    </Switch>
  );
}
