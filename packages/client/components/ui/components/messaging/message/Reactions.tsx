import { For, Show, createMemo } from "solid-js";
import { styled } from "styled-system/jsx";

import { API } from "revolt.js";

import { Emoji } from "@revolt/markdown";
import { useUsers } from "@revolt/markdown/users";

import { Row, Typography } from "../../design";
import { Tooltip } from "../../floating";
import { useLingui } from "@lingui-solid/solid/macro";

interface Props {
  /**
   * Reactions data
   */
  reactions?: Map<string, Set<string>>;

  /**
   * Interactions
   */
  interactions: API.Message["interactions"];

  /**
   * ID of current user
   */
  userId?: string;

  /**
   * Add a reaction
   * @param reaction ID
   */
  addReaction(reaction: string): void;

  /**
   * Remove a reaction
   * @param reaction ID
   */
  removeReaction(reaction: string): void;
}

/**
 * Message reactions
 */
export function Reactions(props: Props) {
  /**
   * Determine two lists of 'required' and 'optional' reactions
   */
  const lists = createMemo(() => {
    const required = new Set<string>();
    const optional = new Set<string>();

    if (props.interactions?.reactions) {
      for (const reaction of props.interactions.reactions) {
        required.add(reaction);
      }
    }

    if (props.reactions) {
      for (const key of props.reactions.keys()) {
        if (!required.has(key)) {
          optional.add(key);
        }
      }
    }

    return {
      required: Array.from(required),
      optional: Array.from(optional),
    };
  });

  /**
   * Determine whether we are showing any reactions
   * @param both Whether to check if both are present
   * @returns Number of either required or optional if present
   */
  const hasReactions = (both?: boolean) => {
    const { required, optional } = lists();
    return both
      ? required.length && optional.length
      : required.length || optional.length;
  };

  return (
    <Show when={hasReactions()}>
      <List>
        <For each={lists().required}>
          {(entry) => (
            <Reaction
              reaction={entry}
              active={props.reactions?.get(entry)?.has(props.userId!)}
              users={props.reactions?.get(entry)}
              addReaction={props.addReaction}
              removeReaction={props.removeReaction}
            />
          )}
        </For>
        <Show when={hasReactions(true)}>
          <Divider />
        </Show>
        <For each={lists().optional}>
          {(entry) => (
            <Reaction
              reaction={entry}
              active={props.reactions?.get(entry)?.has(props.userId!)}
              users={props.reactions?.get(entry)}
              addReaction={props.addReaction}
              removeReaction={props.removeReaction}
            />
          )}
        </For>
        <AddReaction class="add">{"+"}</AddReaction>
      </List>
    </Show>
  );
}

/**
 * Render the reaction
 */
function Reaction(props: {
  reaction: string;
  active?: boolean;
  users?: Set<string>;
  addReaction(id: string): void;
  removeReaction(id: string): void;
}) {
  const { t } = useLingui();
  const users = useUsers([...(props.users?.values() ?? [])]);

  /**
   * Handle toggling reaction
   */
  function onClick() {
    if (props.active) {
      props.removeReaction(props.reaction);
    } else {
      props.addReaction(props.reaction);
    }
  }

  /**
   * Generate list of users
   */
  const peopleList = () => {
    const all = users();
    const list = all.filter((user) => user);
    const unknown =
      all.filter((user) => !user).length + Math.max(0, list.length - 3);

    const usernames = list
      .slice(0, 2)
      .map((user) => user?.username)
      .join(", ");

    if (unknown) {
      if (usernames) {
        return t`${usernames} and ${unknown} others reacted`;
      } else if (unknown === 1) {
        return t`1 person reacted`;
      } else {
        return t`${unknown} reacted`;
      }
    } else {
      return t`${usernames} reacted`;
    }
  };

  return (
    <Tooltip
      placement="top"
      content={() => (
        <Row align gap="lg">
          <span style={{ "--emoji-size": "3em" }}>
            <Emoji emoji={props.reaction} />
          </span>
          <Typography variant="messages">
            <PeopleList>{peopleList()}</PeopleList>
          </Typography>
        </Row>
      )}
      aria={peopleList()}
    >
      <ReactionBase active={props.active} onClick={onClick}>
        <Emoji emoji={props.reaction} /> {props.users?.size || 0}
      </ReactionBase>
    </Tooltip>
  );
}

/**
 * Reaction styling
 */
const ReactionBase = styled("div", {
  base: {
    display: "flex",
    flexDirection: "row",
    gap: "var(--gap-md)",
    cursor: "pointer",
    userSelect: "none",
    verticalAlign: "middle",
    padding: "var(--gap-md)",
    borderRadius: "var(--borderRadius-md)",
    color: "var(--colours-messaging-component-reaction-foreground)",
    background: "var(--colours-messaging-component-reaction-background)",
    transition: "var(--transitions-fast) all",
    fontWeight: 600,
    fontFeatureSettings: "'tnum' 1",
    "& img": {
      width: "1.2em",
      height: "1.2em",
      objectFit: "contain",
    },
    "&:hover": {
      filter: "brightness(0.9)",
    },
    "&:active": {
      filter: "brightness(0.75)",
    },
  },
  variants: {
    active: {
      true: {
        color:
          "var(--colours-messaging-component-reaction-selected-foreground)",
        background:
          "var(--colours-messaging-component-reaction-selected-background)",
      },
    },
  },
});

/**
 * Add reaction button styling
 */
const AddReaction = styled(ReactionBase, {
  base: {
    opacity: 0,
    justifyContent: "center",
    fontSize: "var(--emoji-size)",
    background: "var(--colours-messaging-component-reaction-background)",
    height: "33px",
    aspectRatio: "1/1",
    padding: "var(--gap-sm)",
  },
});

/**
 * List divider
 */
const Divider = styled("div", {
  base: {
    width: "1px",
    height: "14px",
    background: "var(--colours-messaging-component-reaction-foreground)",
  },
});

/**
 * Base component for the reactions list
 */
const List = styled("div", {
  base: {
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "var(--gap-sm)",
    "&:hover .add": {
      opacity: 1,
    },
  },
});

/**
 * List of people who have reacted
 */
const PeopleList = styled("span", {
  base: {
    lineClamp: 2,
    // display: "-webkit-box",
    // WebkitLineClamp: 2,
    // WebkitBoxOrient: "vertical",
    maxWidth: "200px",
    overflow: "hidden",
    whiteSpace: "pre-wrap",
    textOverflow: "ellipsis",
  },
});
