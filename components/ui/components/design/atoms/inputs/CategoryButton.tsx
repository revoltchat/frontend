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

  readonly disabled?: boolean;
  readonly onClick?: () => void;
  readonly action?: Action | Action[];
}

/**
 * Category Button (Fluent)
 */
export function CategoryButton(props: Props) {
  return (
    <Base
      isLink={!!props.onClick}
      disabled={props.disabled}
      aria-disabled={props.disabled}
      onClick={props.disabled ? undefined : props.onClick}
    >
      <IconWrapper>
        <Switch fallback={props.icon}>
          <Match when={props.icon === "blank"}>
            <Blank />
          </Match>
        </Switch>
      </IconWrapper>

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
 * Blank icon
 */
const Blank = styled.div`
  width: 36px;
`;

/**
 * Base container for button
 */
const Base = styled("a", "CategoryButton") <{
  isLink: boolean;
  disabled?: boolean;
}>`
  gap: 16px;
  padding: 13px; /*TODO: make this a prop*/
  color: ${(props) => props.theme!.colour("onBackground")};
  border-radius: ${(props) => props.theme!.borderRadius.md};
  /*background: ${(props) => props.theme!.colour("background")};*/

  background: ${(props) => props.theme!.colour("background", 99)};

  user-select: none;
  cursor: ${(props) =>
    props.disabled ? "not-allowed" : props.isLink ? "pointer" : "initial"};
  transition: background-color .1s ease-in-out;

  display: flex;
  align-items: center;
  flex-direction: row;

  > svg {
    flex-shrink: 0;
  }

  &:hover {
    background-color: ${(props) => props.theme!.colour("background", 100)};
  }

  &:active {
    background-color: ${(props) => props.theme!.colour("background", 94)};
  }
`;

/**
 * Title and description styles
 */
const Content = styled(Column)`
  font-weight: 500;
  font-size: 14px;
  gap: 2px;
  /*color: ${(props) => props.theme!.colour("primary")};*/
  color: ${(props) => props.theme!.colour("onBackground", 10)}
`;

/**
 * Accented wrapper for the category button icons
 */
const IconWrapper = styled.div`
  background: ${(props) => props.theme!.colour("primary", 90)};
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;

  svg {
    fill: ${(props) => props.theme!.colour("primary", 30)};
  }
`;

/**
 * Description shown below title
 */
const Description = styled.span`
  font-weight: 500;
  font-size: 12px;
  color: ${(props) => props.theme!.colour("onBackground", 30)};

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
  color: ${(props) => props.theme!.colour("onBackground")};

  display: grid;
  place-items: center;
`;
