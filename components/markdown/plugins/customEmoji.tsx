import { Match, Switch, createSignal } from "solid-js";

import { useClient } from "@revolt/client";
import { Avatar, Column, Row, Tooltip } from "@revolt/ui";

import { CustomEmoji, Emoji, RE_CUSTOM_EMOJI } from "../emoji";

import { CustomComponentProps, createComponent } from "./remarkRegexComponent";

/**
 * Render a custom emoji
 *
 * This will also display a tooltip and fallback to text if the emoji doesn't exist.
 */
export function RenderCustomEmoji(props: CustomComponentProps) {
  const [exists, setExists] = createSignal(true);

  const client = useClient();
  const emoji = () => client()!.emojis.get(props.match);
  const server = () =>
    client()!.servers.get(
      (emoji()!.parent as { type: "Server"; id: string }).id
    )!;

  return (
    <Switch fallback={<span>{`:${emoji()?.name ?? props.match}:`}</span>}>
      <Match when={exists()}>
        <Tooltip
          placement="top"
          content={
            <Row align gap="lg">
              <span style={{ "--emoji-size": "3em" }}>
                <Emoji emoji={props.match} />
              </span>
              <Switch fallback="Unknown emote">
                <Match when={emoji()?.parent.type === "Server"}>
                  <Column align>
                    <span>{`:${emoji()!.name}:`}</span>
                    <Row align>
                      <Avatar size={14} src={server().animatedIconURL} />
                      {server().name}
                    </Row>
                  </Column>
                </Match>
              </Switch>
            </Row>
          }
        >
          <CustomEmoji id={props.match} onError={() => setExists(false)} />
        </Tooltip>
      </Match>
    </Switch>
  );
}

export const remarkCustomEmoji = createComponent("cemoji", RE_CUSTOM_EMOJI);
