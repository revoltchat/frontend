import type { API } from "revolt.js";

import { SizedContent } from "../../design";

import { E } from "./Embed";

/**
 * Type assertion for special embeds
 */
export type S<T extends API.Special["type"]> = API.Special & { type: T };

export function SpecialEmbed(props: { embed: E<"Website"> }) {
  const special = props.embed.special!;

  let width, height, src;
  switch (special.type) {
    case "YouTube": {
      width = props.embed.video?.width ?? 1280;
      height = props.embed.video?.height ?? 720;

      let timestamp = "";
      if (special.timestamp) {
        timestamp = `&start=${special.timestamp}`;
      }

      src = `https://www.youtube-nocookie.com/embed/${special.id}?modestbranding=1${timestamp}`;
      break;
    }
    case "Twitch": {
      (width = 1280),
        (height = 720),
        (src = `https://player.twitch.tv/?${special.content_type.toLowerCase()}=${
          special.id
        }&parent=${window.location.hostname}&autoplay=false`);
      break;
    }
    case "Lightspeed": {
      (width = 1280),
        (height = 720),
        (src = `https://new.lightspeed.tv/embed/${special.id}/stream`);
      break;
    }
    case "Spotify": {
      (width = 420),
        (height = 355),
        (src = `https://open.spotify.com/embed/${special.content_type}/${special.id}`);
      break;
    }
    case "Soundcloud": {
      (width = 480),
        (height = 460),
        (src = `https://w.soundcloud.com/player/?url=${encodeURIComponent(
          props.embed.url!
        )}&color=%23FF7F50&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`);
      break;
    }
    case "Bandcamp": {
      width = props.embed.video?.width ?? 1280;
      height = props.embed.video?.height ?? 720;

      src = `https://bandcamp.com/EmbeddedPlayer/${special.content_type.toLowerCase()}=${
        special.id
      }/size=large/bgcol=181a1b/linkcol=056cc4/tracklist=false/transparent=true/`;
      break;
    }
    default:
      return null;
  }

  return (
    <SizedContent width={width} height={height}>
      <iframe
        // @ts-expect-error attributes are not recognised
        loading="lazy"
        scrolling="no"
        allowFullScreen
        allowTransparency
        frameBorder={0}
        style={{ width: width + "px" }}
        src={src}
      />
    </SizedContent>
  );
}
