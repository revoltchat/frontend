import { clientController } from "@revolt/client";

import { Emoji } from "./unicodeEmoji";
import { createSignal, Match, Switch } from "solid-js";
import { createComponent, CustomComponentProps } from "./remarkRegexComponent";

export const RE_CUSTOM_EMOJI = /:([0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}):/g;

export function RenderCustomEmoji({ match }: CustomComponentProps) {
  const [exists, setExists] = createSignal(true);
  const url = `${
    clientController.getAvailableClient()?.configuration?.features.autumn.url
  }/emojis/${match}`;

  return (
    <Switch fallback={<span>{`:${match}:`}</span>}>
      <Match when={exists()}>
        <Emoji
          loading="lazy"
          class="emoji"
          draggable={false}
          src={url}
          onError={() => setExists(false)}
        />
      </Match>
    </Switch>
  );
}

export const remarkCustomEmoji = createComponent("cemoji", RE_CUSTOM_EMOJI);
