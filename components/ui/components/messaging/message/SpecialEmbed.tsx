import type { WebsiteEmbed } from "revolt.js";

import { SizedContent } from "../../design";

/**
 * Special Embed
 */
export function SpecialEmbed(props: { embed: WebsiteEmbed }) {
  const special = props.embed.specialContent!;

  let width, height;
  switch (special.type) {
    case "YouTube": {
      width = props.embed.video?.width ?? 1280;
      height = props.embed.video?.height ?? 720;
      break;
    }
    case "Twitch": {
      (width = 1280), (height = 720);
      break;
    }
    case "Lightspeed": {
      (width = 1280), (height = 720);
      break;
    }
    case "Spotify": {
      (width = 420), (height = 355);
      break;
    }
    case "Soundcloud": {
      (width = 480), (height = 460);
      break;
    }
    case "Bandcamp": {
      width = props.embed.video?.width ?? 1280;
      height = props.embed.video?.height ?? 720;
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
        src={props.embed.embedURL}
      />
    </SizedContent>
  );
}
