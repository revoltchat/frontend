import { API } from "revolt.js";
import { For, Match, Switch } from "solid-js";
import { SizedContent } from "../../design/layout/SizedContent";

/**
 * Type assertion for embeds
 */
type E<T extends API.Embed["type"]> = API.Embed & { type: T };

/**
 * Render a given list of embeds
 */
export function Embeds({
  embeds,
  proxyFile,
}: {
  embeds: () => API.Embed[];
  proxyFile: (url: string) => string | undefined;
}) {
  return (
    <For each={embeds()}>
      {(embed) => (
        <Switch fallback={`Could not render ${embed.type}!`}>
          <Match when={embed.type === "Website"}>
            <div>Website</div>
          </Match>
          <Match when={embed.type === "Image"}>
            <SizedContent
              width={(embed as E<"Image">).width}
              height={(embed as E<"Image">).height}
            >
              <img src={proxyFile((embed as E<"Image">).url)} loading="lazy" />
            </SizedContent>
          </Match>
          <Match when={embed.type === "Video"}>
            <SizedContent
              width={(embed as E<"Video">).width}
              height={(embed as E<"Video">).height}
            >
              <video
                controls
                preload="metadata"
                src={proxyFile((embed as E<"Video">).url)}
              />
            </SizedContent>
          </Match>
          <Match when={embed.type === "Text"}>
            <div>Text</div>
          </Match>
          <Match when={embed.type === "None"}> </Match>
        </Switch>
      )}
    </For>
  );
}
