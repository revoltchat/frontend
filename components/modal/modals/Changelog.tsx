import type { Action } from "@revolt/ui/components/design/atoms/display/Modal";
import { createSignal, For, Match, Switch } from "solid-js";
import { CategoryButton, Column, styled } from "@revolt/ui";
import { dayjs, useTranslation } from "@revolt/i18n";
import { ModalProps, PropGenerator } from "../types";

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
 * Image wrapper
 */
const Image = styled.img`
  border-radius: var(--border-radius);
`;

/**
 * Render a single changelog post
 */
function RenderLog({ post }: { post: ChangelogPost }) {
  return (
    <Column>
      <For each={post.content}>
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
 * Modal to display changelog
 */
const Changelog: PropGenerator<"changelog"> = (
  props: ModalProps<"changelog">
) => {
  const t = useTranslation();
  const [log, setLog] = createSignal(props.initial);
  const currentLog = () =>
    typeof log() !== "undefined" ? props.posts[log()!] : undefined;

  return {
    title: (
      <Switch fallback={t("app.special.modals.changelogs.title")}>
        <Match when={currentLog()}>{currentLog()!.title}</Match>
      </Switch>
    ),
    description: (
      <Switch fallback={t("app.special.modals.changelogs.description")}>
        <Match when={currentLog()}>
          {dayjs(currentLog()!.date).calendar()}
        </Match>
      </Switch>
    ),
    actions: () => {
      const actions: Action[] = [
        {
          palette: "primary",
          children: t("app.special.modals.actions.close"),
          onClick: () => true,
        },
      ];

      if (currentLog()) {
        actions.push({
          palette: "plain-secondary",
          children: t("app.special.modals.changelogs.older"),
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
              {(entry, index) => (
                <CategoryButton onClick={() => setLog(index)}>
                  {entry.title}
                </CategoryButton>
              )}
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

export default Changelog;
