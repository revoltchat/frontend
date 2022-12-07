import { API } from "revolt.js";
import { Match, Switch } from "solid-js";
import { SizedContent } from "../../design/layout/SizedContent";

/**
 * Type assertion for embeds
 */
type E<T extends API.Embed["type"]> = API.Embed & { type: T };

/**
 * Render a given list of embeds
 */
export function Embed(props: {
  embed: API.Embed;
  proxyFile: (url: string) => string | undefined;
}) {
  return (
    <Switch fallback={`Could not render ${props.embed.type}!`}>
      <Match when={props.embed.type === "Website"}>
        <div>Website</div>
      </Match>
      <Match when={props.embed.type === "Image"}>
        <SizedContent
          width={(props.embed as E<"Image">).width}
          height={(props.embed as E<"Image">).height}
        >
          <img src={props.proxyFile((props.embed as E<"Image">).url)} loading="lazy" />
        </SizedContent>
      </Match>
      <Match when={props.embed.type === "Video"}>
        <SizedContent
          width={(props.embed as E<"Video">).width}
          height={(props.embed as E<"Video">).height}
        >
          <video
            controls
            preload="metadata"
            src={props.proxyFile((props.embed as E<"Video">).url)}
          />
        </SizedContent>
      </Match>
      <Match when={props.embed.type === "Text"}>
        <div>Text</div>
      </Match>
      <Match when={props.embed.type === "None"}> </Match>
    </Switch>
  );
}
