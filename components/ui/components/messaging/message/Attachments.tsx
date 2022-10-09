import { API } from "revolt.js";
import { Column } from "../../design/layout";
import { styled } from "solid-styled-components";
import { For, Match, Show, Switch } from "solid-js";
import { Spoiler } from "../../design/layout/Spoiler";
import { SizedContent } from "../../design/layout/SizedContent";
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
export function Attachments({
  attachments,
  baseUrl,
}: {
  attachments: () => API.File[];
  baseUrl: string;
}) {
  return (
    <For each={attachments()}>
      {(file) => {
        const link = `${baseUrl}/attachments/${file._id}`;
        const download = `${baseUrl}/attachments/download/${file._id}`;
        const size = humanFileSize(file.size);
        const info = {
          file,
          link,
          download,
          size,
        };

        const hasSpoiler = () =>
          file.filename.toLowerCase().startsWith("spoiler_");

        return (
          <Switch fallback={`Could not render ${file.metadata.type}!`}>
            <Match when={file.metadata.type === "Image"}>
              <SizedContent
                width={(file.metadata as Meta<"Image">).width}
                height={(file.metadata as Meta<"Image">).height}
              >
                <Show when={hasSpoiler()}>
                  <Spoiler contentType="Image" />
                </Show>
                <img
                  src={`${link}${
                    file.content_type === "image/gif" ? "" : "?max_side=512"
                  }`}
                  loading="lazy"
                />
              </SizedContent>
            </Match>
            <Match when={file.metadata.type === "Video"}>
              <SizedContent
                width={(file.metadata as Meta<"Video">).width}
                height={(file.metadata as Meta<"Video">).height}
              >
                <Show when={hasSpoiler()}>
                  <Spoiler contentType="Video" />
                </Show>
                <video controls preload="metadata" src={link} />
              </SizedContent>
            </Match>
            <Match when={file.metadata.type === "Audio"}>
              <AttachmentContainer>
                <FileInfo {...info} />
                <SizedContent width={360} height={48}>
                  <audio controls src={link} />
                </SizedContent>
              </AttachmentContainer>
            </Match>
            <Match when={file.metadata.type === "File"}>
              <AttachmentContainer>
                <FileInfo {...info} />
              </AttachmentContainer>
            </Match>
            <Match when={file.metadata.type === "Text"}>
              <AttachmentContainer>
                <FileInfo {...info} />
                <SizedContent width={480} height={120}>
                  <TextFile file={file} baseUrl={baseUrl} />
                </SizedContent>
              </AttachmentContainer>
            </Match>
          </Switch>
        );
      }}
    </For>
  );
}
