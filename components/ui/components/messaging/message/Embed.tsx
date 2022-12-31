import { API } from "revolt.js";
import { Match, Switch } from "solid-js";
import { SizedContent } from "../../design/layout/SizedContent";
import { TextEmbed } from "./TextEmbed";

/**
 * Type assertion for embeds
 */
export type E<T extends API.Embed["type"]> = API.Embed & { type: T };

/**
 * Render a given embed
 */
export function Embed(props: {
  embed: API.Embed;
  baseUrl: string;
  proxyFile: (url: string) => string | undefined;
}) {
  const isGIF =
    props.embed.type === "Website" && props.embed.special?.type === "GIF";

  const video =
    (props.embed.type === "Video"
      ? props.embed
      : isGIF && (props.embed as E<"Website">).video) || undefined;

  const image =
    (props.embed.type === "Image"
      ? props.embed
      : isGIF && (props.embed as E<"Website">).image) || undefined;

  return (
    <Switch fallback={`Could not render ${props.embed.type}!`}>
      <Match when={video}>
        <SizedContent width={video!.width} height={video!.height}>
          <video
            loop={isGIF}
            muted={isGIF}
            autoplay={isGIF}
            controls={!isGIF}
            preload="metadata"
            src={props.proxyFile(video!.url)}
          />
        </SizedContent>
      </Match>
      <Match when={image}>
        <SizedContent width={image!.width} height={image!.height}>
          <img src={props.proxyFile(image!.url)} loading="lazy" />
        </SizedContent>
      </Match>
      <Match
        when={props.embed.type === "Website" || props.embed.type === "Text"}
      >
        <TextEmbed
          embed={props.embed as E<"Website" | "Text">}
          proxyFile={props.proxyFile}
          baseUrl={props.baseUrl}
        />
      </Match>
      <Match when={props.embed.type === "None"}> </Match>
    </Switch>
  );
}
