import { Show } from "solid-js";

import { css } from "styled-system/css";

import { Markdown } from "@revolt/markdown";

import { Text, typography } from "../design";
import { Ripple } from "../material";

import { ProfileCard } from "./ProfileCard";
import { styled } from "styled-system/jsx";

interface Props {
  full?: boolean;
  content?: string;
  onClick?: () => void;
}

/**
 * Profile biography
 */
export function ProfileBio(props: Props) {
  return (
    <Show when={props.content}>
    <ProfileCard
      onClick={props.onClick}
      isLink={typeof props.onClick !== "undefined"}
      width={props.full ? 3 : 2}
      constraint={props.full ? undefined : "half"}
    >
      <Show when={props.onClick}>
        <Ripple />
      </Show>

      <Text class="title" size="large">
        Bio
      </Text>

      <Bio>
        <Markdown content={props.content} />
      </Bio>
    </ProfileCard>
    </Show>
  );
}

const Bio = styled('span', {
  base: {
    ...typography.raw({ class: '_messages' }),
    userSelect: 'text'
  }
});
