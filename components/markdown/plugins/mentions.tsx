import { Switch } from "solid-js";
import { styled } from "solid-styled-components";

import { RE_MENTIONS } from "revolt.js";

import { clientController, useClient } from "@revolt/client";
import { Avatar, ColouredText } from "@revolt/ui";

import { useUser } from "../users";

import { CustomComponentProps, createComponent } from "./remarkRegexComponent";

const Mention = styled.a`
  gap: 4px;
  flex-shrink: 0;
  padding-left: 2px;
  padding-right: 6px;
  align-items: center;
  display: inline-flex;
  vertical-align: middle;

  cursor: pointer;

  font-weight: 600;
  text-decoration: none !important;
  border-radius: ${(props) => props.theme!.borderRadius.lg};
  color: ${(props) =>
    props.theme!.colours["messaging-component-mention-foreground"]};
  background: ${(props) =>
    props.theme!.colours["messaging-component-mention-background"]};

  transition: 0.1s ease filter;

  &:hover {
    filter: brightness(0.75);
  }

  &:active {
    filter: brightness(0.65);
  }

  svg {
    width: 1em;
    height: 1em;
  }
`;

export function RenderMention(props: CustomComponentProps) {
  const user = useUser(props.match);

  return (
    <Mention>
      <Avatar size={16} src={user()!.avatar} />
      <ColouredText
        colour={user()!.colour!}
        clip={user()!.colour?.includes("gradient")}
      >
        {user()!.username}
      </ColouredText>
    </Mention>
  );
}

export const remarkMention = createComponent("mention", RE_MENTIONS, (match) =>
  clientController.getCurrentClient()!.users.has(match)
);
