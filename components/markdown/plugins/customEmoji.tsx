import { useClient } from "@revolt/client";

import { Emoji } from "./unicodeEmoji";
import { createSignal, Match, Switch } from "solid-js";
import { createComponent, CustomComponentProps } from "./remarkRegexComponent";
import { Avatar, Column, Row, Tooltip } from "@revolt/ui";

export const RE_CUSTOM_EMOJI = /:([0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}):/g;

export function RenderCustomEmoji({ match }: CustomComponentProps) {
  const [exists, setExists] = createSignal(true);

  const client = useClient();
  const url = `${client.configuration?.features.autumn.url}/emojis/${match}`;

  const emoji = () => client.emojis.get(match);
  const server = () =>
    client.servers.get((emoji()!.parent as { type: "Server"; id: string }).id)!;

  return (
    <Switch fallback={<span>{`:${emoji()?.name ?? match}:`}</span>}>
      <Match when={exists()}>
        <Tooltip
          placement="top"
          content={
            <Row align gap="lg">
              <span style={{ "--emoji-size": "3em" }}>
                <Emoji src={url} />
              </span>
              <Switch fallback="Unknown emote">
                <Match when={emoji()?.parent.type === "Server"}>
                  <Column align>
                    <span>{`:${emoji()!.name}:`}</span>
                    <Row align>
                      <Avatar size={14} src={server().generateIconURL()} />
                      {server().name}
                    </Row>
                  </Column>
                </Match>
              </Switch>
            </Row>
          }
        >
          {(triggerProps) => (
            <Emoji
              {...triggerProps}
              loading="lazy"
              class="emoji"
              draggable={false}
              src={url}
              onError={() => setExists(false)}
            />
          )}
        </Tooltip>
      </Match>
    </Switch>
  );
}

export const remarkCustomEmoji = createComponent("cemoji", RE_CUSTOM_EMOJI);
