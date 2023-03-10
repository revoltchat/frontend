import {
  BiRegularDownload,
  BiRegularHeadphone,
  BiRegularLinkExternal,
  BiSolidFile,
  BiSolidFileTxt,
  BiSolidImage,
  BiSolidVideo,
} from "solid-icons/bi";
import { Match, Show, Switch } from "solid-js";
import { styled } from "solid-styled-components";

import { API } from "revolt.js";

import { Typography } from "../../design/atoms/display/Typography";
import { Column, Row } from "../../design/layout";

interface Props {
  /**
   * File information
   */
  file?: API.File;

  /**
   * Embed information
   */
  embed?: API.Embed;

  /**
   * File size
   */
  size?: string;

  /**
   * Direct link to the file
   */
  link?: string;

  /**
   * Download link for the file
   */
  download?: string;
}

/**
 * Base container
 */
const Base = styled(Row)`
  color: ${(props) => props.theme!.colours["foreground"]};
`;

/**
 * Link action
 */
const Action = styled("a")`
  color: ${(props) => props.theme!.colours["foreground-100"]};

  display: grid;
  place-items: center;
`;

/**
 * Information about a given attachment or embed
 */
export function FileInfo(props: Props) {
  return (
    <Base align>
      <Action>
        <Switch fallback={<BiSolidFile size={24} />}>
          <Match
            when={
              props.file?.metadata.type === "Image" ||
              props.embed?.type === "Image"
            }
          >
            <BiSolidImage size={24} />
          </Match>
          <Match
            when={
              props.file?.metadata.type === "Video" ||
              props.embed?.type === "Video"
            }
          >
            <BiSolidVideo size={24} />
          </Match>
          <Match when={props.file?.metadata.type === "Audio"}>
            <BiRegularHeadphone size={24} />
          </Match>
          <Match when={props.file?.metadata.type === "Text"}>
            <BiSolidFileTxt size={24} />
          </Match>
        </Switch>
      </Action>
      <Column grow gap="none">
        <span>{props.file?.filename}</span>
        <Show when={props.size}>
          <Typography variant="small">{props.size}</Typography>
        </Show>
      </Column>
      <Show when={props.link}>
        <Action href={props.link} target="_blank" rel="noreferrer">
          <BiRegularLinkExternal size={24} />
        </Action>
      </Show>
      <Show when={props.download}>
        <Action href={props.download}>
          <BiRegularDownload size={24} />
        </Action>
      </Show>
    </Base>
  );
}
