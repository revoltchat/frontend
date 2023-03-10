import { Match, Show, Switch } from "solid-js";
import { styled } from "solid-styled-components";

import { API } from "revolt.js";

import { Column } from "../../design/layout";
import { SizedContent } from "../../design/layout/SizedContent";
import { Spoiler } from "../../design/layout/Spoiler";

import { FileInfo } from "./FileInfo";
import { TextFile } from "./TextFile";

/**
 * Type assertion for file metadata
 */
type Meta<T extends API.File["metadata"]["type"]> = API.File["metadata"] & {
  type: T;
};

/**
 * List of attachments
 */
export const AttachmentContainer = styled(Column)`
  padding: ${(props) => props.theme!.gap.md};
  border-radius: ${(props) => props.theme!.borderRadius.md};
  background: ${(props) => props.theme!.colours["background-100"]};
`;

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
export function Attachment(props: { file: API.File; baseUrl: string }) {
  const link = `${props.baseUrl}/attachments/${props.file._id}`;
  const download = `${props.baseUrl}/attachments/download/${props.file._id}`;
  const size = humanFileSize(props.file.size);
  const info = {
    file: props.file,
    link,
    download,
    size,
  };

  const hasSpoiler = () =>
    props.file.filename.toLowerCase().startsWith("spoiler_");

  return (
    <Switch fallback={`Could not render ${props.file.metadata.type}!`}>
      <Match when={props.file.metadata.type === "Image"}>
        <SizedContent
          width={(props.file.metadata as Meta<"Image">).width}
          height={(props.file.metadata as Meta<"Image">).height}
        >
          <Show when={hasSpoiler()}>
            <Spoiler contentType="Image" />
          </Show>
          <img
            src={`${link}${
              props.file.content_type === "image/gif" ? "" : "?max_side=512"
            }`}
            loading="lazy"
          />
        </SizedContent>
      </Match>
      <Match when={props.file.metadata.type === "Video"}>
        <SizedContent
          width={(props.file.metadata as Meta<"Video">).width}
          height={(props.file.metadata as Meta<"Video">).height}
        >
          <Show when={hasSpoiler()}>
            <Spoiler contentType="Video" />
          </Show>
          <video controls preload="metadata" src={link} />
        </SizedContent>
      </Match>
      <Match when={props.file.metadata.type === "Audio"}>
        <AttachmentContainer>
          <FileInfo {...info} />
          <SizedContent width={360} height={48}>
            <audio controls src={link} />
          </SizedContent>
        </AttachmentContainer>
      </Match>
      <Match when={props.file.metadata.type === "File"}>
        <AttachmentContainer>
          <FileInfo {...info} />
        </AttachmentContainer>
      </Match>
      <Match when={props.file.metadata.type === "Text"}>
        <AttachmentContainer>
          <FileInfo {...info} />
          <SizedContent width={480} height={120}>
            <TextFile file={props.file} baseUrl={props.baseUrl} />
          </SizedContent>
        </AttachmentContainer>
      </Match>
    </Switch>
  );
}
