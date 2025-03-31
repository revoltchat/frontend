import { For, Match, Switch, createSignal } from "solid-js";

import { Trans } from "@lingui-solid/solid/macro";
import { styled } from "styled-system/jsx";

import { useTime } from "@revolt/i18n";
import { CategoryButton, Column } from "@revolt/ui";
import type { Action } from "@revolt/ui/components/design/atoms/display/Modal";

import { PropGenerator } from "../types";

/**
 * Changelog element
 */
type Element =
  | string
  | {
      type: "image";
      src: string;
    };

/**
 * Changelog post
 */
export interface ChangelogPost {
  date: Date;
  title: string;
  content: Element[];
}

/**
 * Modal to display changelog
 */
const Changelog: PropGenerator<"changelog"> = (props) => {
  const dayjs = useTime();

  const [log, setLog] = createSignal(props.initial);

  /**
   * Get the currently selected log
   * @returns Log
   */
  const currentLog = () =>
    typeof log() !== "undefined" ? props.posts[log()!] : undefined;

  return {
    title: (
      <Switch fallback={<Trans>Changelog</Trans>}>
        <Match when={currentLog()}>{currentLog()!.title}</Match>
      </Switch>
    ),
    description: (
      <Switch fallback={<Trans>Read about updates to Revolt.</Trans>}>
        <Match when={currentLog()}>
          {dayjs(currentLog()!.date).calendar()}
        </Match>
      </Switch>
    ),
    actions: () => {
      const actions: Action[] = [
        {
          variant: "primary",
          children: <Trans>Close</Trans>,
          onClick: () => true,
        },
      ];

      if (currentLog()) {
        actions.push({
          variant: "plain",
          children: <Trans>View older updates</Trans>,
          onClick: () => {
            setLog(undefined);
            return false;
          },
        });
      }

      return actions;
    },
    children: (
      <Switch
        fallback={
          <Column>
            <For each={props.posts}>
              {(entry, index) => {
                /**
                 * Handle changing post
                 */
                const onClick = () => setLog(index());

                return (
                  <CategoryButton onClick={onClick}>
                    {entry.title}
                  </CategoryButton>
                );
              }}
            </For>
          </Column>
        }
      >
        <Match when={currentLog()}>
          <RenderLog post={currentLog()!} />
        </Match>
      </Switch>
    ),
  };
};

/**
 * Render a single changelog post
 */
function RenderLog(props: { post: ChangelogPost }) {
  return (
    <Column>
      <For each={props.post.content}>
        {(entry) => (
          <Switch>
            <Match when={typeof entry === "string"}>{entry as string}</Match>
            <Match when={typeof entry === "object" && entry.type === "image"}>
              <Image src={(entry as { src: string }).src} />
            </Match>
          </Switch>
        )}
      </For>
    </Column>
  );
}

/**
 * Image wrapper
 */
const Image = styled("img", {
  base: {
    borderRadius: "var(--border-radius)",
  },
});

export default Changelog;
