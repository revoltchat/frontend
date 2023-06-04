import {
  BiRegularLinkExternal,
  BiSolidChevronDown,
  BiSolidChevronRight,
} from "solid-icons/bi";
import { For, JSX, Match, Show, Switch } from "solid-js";
import { styled } from "solid-styled-components";

import { Column, OverflowingText } from "../../layout";

/**
 * Permissible actions
 */
type Action = "chevron" | "collapse" | "external" | "edit" | JSX.Element;

export interface Props {
  readonly icon?: JSX.Element | "blank";
  readonly children?: JSX.Element;
  readonly description?: JSX.Element;

  readonly onClick?: () => void;
  readonly action?: Action | Action[];
}

/**
 * Category Button
 */
export function CategoryButton(props: Props) {
  return (
    <Base isLink={!!props.onClick} onClick={props.onClick}>
      <Switch fallback={props.icon}>
        <Match when={props.icon === "blank"}>
          <Blank />
        </Match>
      </Switch>
      <Content grow gap="sm">
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
                <BiSolidChevronRight size={20} />
              </Action>
            </Match>
            <Match when={action === "collapse"}>
              <Action>
                <BiSolidChevronDown size={20} />
              </Action>
            </Match>
            <Match when={action === "external"}>
              <Action>
                <BiRegularLinkExternal size={20} />
              </Action>
            </Match>
          </Switch>
        )}
      </For>
    </Base>
  );
}

/**
 * Blank icon
 */
const Blank = styled.div`
  width: 24px;
`;

/**
 * Base container for button
 */
const Base = styled("a", "CategoryButton")<{ isLink: boolean }>`
  gap: 12px;
  padding: 14px 16px;

  color: ${(props) => props.theme!.scheme.onBackground};
  border-radius: ${(props) => props.theme!.borderRadius.xl};
  background: ${(props) => props.theme!.scheme.background};

  user-select: none;
  cursor: ${(props) => (props.isLink ? "pointer" : "initial")};
  transition: ${(props) => props.theme!.transitions.fast} all;

  display: flex;
  align-items: center;
  flex-direction: row;

  > svg {
    flex-shrink: 0;
  }

  &:hover {
    filter: ${(props) => (props.isLink ? props.theme!.effects.hover : "unset")};
  }

  &:active {
    filter: ${(props) =>
      props.isLink ? props.theme!.effects.active : "unset"};
  }
`;

/**
 * Title and description styles
 */
const Content = styled(Column)`
  font-weight: 600;
  font-size: 0.875rem;
`;

/**
 * Description shown below title
 */
const Description = styled.span`
  font-weight: 400;
  font-size: 0.6875rem;
  color: ${(props) => props.theme!.colours["foreground-200"]};

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
  color: ${(props) => props.theme!.scheme.onPrimary};
  background: ${(props) => props.theme!.scheme.primary};
  border-radius: ${(props) => props.theme!.borderRadius.full};

  display: grid;
  place-items: center;
`;
