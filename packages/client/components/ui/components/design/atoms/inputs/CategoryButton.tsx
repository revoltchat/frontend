import {
  BiRegularLinkExternal,
  BiSolidChevronDown,
  BiSolidChevronRight,
} from "solid-icons/bi";
import { For, JSX, Match, Show, Switch, splitProps } from "solid-js";
import { styled } from "solid-styled-components";

import { createButton } from "@solid-aria/button";
import { createFocusRing } from "@solid-aria/focus";

import { Column, OverflowingText } from "../../layout";

/**
 * Permissible actions
 */
type Action = "chevron" | "collapse" | "external" | "edit" | JSX.Element;

export interface Props {
  readonly icon?: JSX.Element | "blank";
  readonly children?: JSX.Element;
  readonly description?: JSX.Element;

  readonly isDisabled?: boolean;
  readonly onPress?: () => void;
  readonly action?: Action | Action[];
}

/**
 * Category Button (Fluent)
 */
export function CategoryButton(sourceProps: Props) {
  const [props, rest] = splitProps(sourceProps, [
    "icon",
    "children",
    "description",
    "action",
  ]);

  let ref: HTMLButtonElement | undefined;
  const { buttonProps } = createButton(rest, () => ref);

  return (
    <Base {...buttonProps} isLink={!!rest.onPress} ref={ref}>
      <Show when={props.icon !== "blank"}>
        <IconWrapper>{props.icon}</IconWrapper>
      </Show>

      <Show when={props.icon === "blank"}>
        <BlankIconWrapper />
      </Show>

      <Content grow>
        <Show when={props.children}>
          <OverflowingText>{props.children}</OverflowingText>
        </Show>
        <Show when={props.description}>
          <Description>{props.description}</Description>
        </Show>
      </Content>
      <For each={Array.isArray(props.action) ? props.action : [props.action]}>
        {(action) => (
          <Switch fallback={action}>
            <Match when={action === "chevron"}>
              <Action>
                <BiSolidChevronRight size={18} />
              </Action>
            </Match>
            <Match when={action === "collapse"}>
              <Action>
                <BiSolidChevronDown size={18} />
              </Action>
            </Match>
            <Match when={action === "external"}>
              <Action>
                <BiRegularLinkExternal size={18} />
              </Action>
            </Match>
          </Switch>
        )}
      </For>
    </Base>
  );
}

/**
 * Base container for button
 */
const Base = styled("button", "CategoryButton")<{
  isLink: boolean;
  disabled?: boolean;
}>`
  gap: 16px;
  padding: 13px; /*TODO: make this a prop*/
  border-radius: ${(props) => props.theme!.borderRadius.md};

  text-align: left;
  color: ${(props) => props.theme!.colours["component-categorybtn-foreground"]};
  background: ${(props) =>
    props.theme!.colours["component-categorybtn-background"]};

  user-select: none;
  cursor: ${(props) =>
    props.disabled ? "not-allowed" : props.isLink ? "pointer" : "initial"};
  transition: background-color 0.1s ease-in-out;

  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: row;

  > svg {
    flex-shrink: 0;
  }

  &:hover {
    background-color: ${(props) =>
      props.theme!.colours["component-categorybtn-background-hover"]};
  }

  &:active {
    background-color: ${(props) =>
      props.theme!.colours["component-categorybtn-background-active"]};
  }
`;

/**
 * Title and description styles
 */
const Content = styled(Column)`
  font-weight: 500;
  font-size: 14px;
  gap: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

/**
 * Accented wrapper for the category button icons
 */
const IconWrapper = styled.div`
  background: ${(props) =>
    props.theme!.colours["component-categorybtn-background-icon"]};

  width: 36px;
  height: 36px;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 50%;

  svg {
    color: ${(props) =>
      props.theme!.colours["component-categorybtn-foreground-description"]};
  }
`;

/**
 * Category button icon wrapper for the blank state
 */
const BlankIconWrapper = styled(IconWrapper)`
  background: transparent;
`;

/**
 * Description shown below title
 */
const Description = styled.span`
  font-weight: 500;
  font-size: 12px;
  color: ${(props) =>
    props.theme!.colours["component-categorybtn-foreground-description"]};

  a:hover {
    text-decoration: underline;
  }
`;

/**
 * Container for action icons
 */
const Action = styled.div`
  width: 24px;
  height: 24px;
  flex-shrink: 0;

  display: grid;
  place-items: center;
`;
