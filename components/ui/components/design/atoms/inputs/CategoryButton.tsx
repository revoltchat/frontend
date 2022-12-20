import { BiRegularLinkExternal, BiSolidChevronRight } from "solid-icons/bi";
import { JSX, Match, Show, Switch } from "solid-js";
import { styled } from "solid-styled-components";
import { Column, OverflowingText } from "../../layout";

export interface Props {
  readonly icon?: JSX.Element;
  readonly children?: JSX.Element;
  readonly description?: JSX.Element;

  readonly onClick?: () => void;
  readonly action?: "chevron" | "external" | JSX.Element;
}

const Base = styled("a", "CategoryButton")`
  gap: 12px;
  padding: 10px 12px;
  margin-bottom: 10px;

  color: ${(props) => props.theme!.colours["foreground"]};
  border-radius: ${(props) => props.theme!.borderRadius.md};
  background: ${(props) => props.theme!.colours["background-200"]};

  cursor: pointer;
  transition: ${(props) => props.theme!.transitions.fast} all;

  display: flex;
  align-items: center;
  flex-direction: row;

  > svg {
    flex-shrink: 0;
  }

  &:hover {
    filter: brightness(0.8);
  }

  &:active {
    filter: brightness(0.9);
  }
`;

const Content = styled(Column)`
  font-weight: 600;
  font-size: 0.875rem;
`;

const Description = styled(OverflowingText)`
  font-size: 0.6875rem;
  font-weight: 400;
  color: ${(props) => props.theme!.colours["foreground-200"]};

  a:hover {
    text-decoration: underline;
  }
`;

export function CategoryButton(props: Props) {
  return (
    <Base onClick={props.onClick}>
      {props.icon}
      <Content grow>
        <Show when={props.children}>
          <OverflowingText>{props.children}</OverflowingText>
        </Show>
        <Show when={props.description}>
          <Description>{props.description}</Description>
        </Show>
      </Content>
      <Switch fallback={props.action}>
        <Match when={props.action === "chevron"}>
          <BiSolidChevronRight size={24} />
        </Match>
        <Match when={props.action === "external"}>
          <BiRegularLinkExternal size={20} />
        </Match>
      </Switch>
    </Base>
  );
}
