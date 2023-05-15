import { BiSolidChevronRight } from "solid-icons/bi";
import { For, JSX, Match, Show, Switch } from "solid-js";
import { styled } from "solid-styled-components";

import { Row } from "../../layout";

interface Props {
  elements: string[];
  navigate: (keys: string[]) => void;
  renderElement: (key: string) => JSX.Element;
}

/**
 * Breadcrumbs
 */
export function Breadcrumbs(props: Props) {
  return (
    <Base wrap align>
      <For each={props.elements}>
        {(element, index) => (
          <>
            <Show when={index() !== 0}>
              <BiSolidChevronRight size="0.8em" />
            </Show>
            <Switch
              fallback={
                <Unselected
                  onClick={() =>
                    props.navigate(props.elements.slice(0, index() + 1))
                  }
                >
                  {props.renderElement(element)}
                </Unselected>
              }
            >
              <Match when={index() === props.elements.length - 1}>
                <Selected>{props.renderElement(element)}</Selected>
              </Match>
            </Switch>
          </>
        )}
      </For>
    </Base>
  );
}

/**
 * Base styles
 */
const Base = styled(Row)`
  user-select: none;
  color: ${(props) => props.theme!.colours["foreground-300"]};
`;

/**
 * Unselected styles
 */
const Unselected = styled.div`
  cursor: pointer;
  transition: ${(props) => props.theme!.transitions.fast} filter;

  &:hover {
    filter: brightness(1.1);
  }

  &:active {
    filter: brightness(1.2);
  }
`;

/**
 * Selected styles
 */
const Selected = styled.div`
  color: ${(props) => props.theme!.colours["foreground"]};
`;
