import { BiSolidChevronRight } from "solid-icons/bi";
import { For, JSX, Match, Show, Switch } from "solid-js";
import { styled } from "styled-system/jsx";

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
        {(element, index) => {
          /**
           * Segments of path
           */
          const segments = () => props.elements.slice(0, index() + 1);

          /**
           * Navigate to page
           */
          const navigate = () => props.navigate(segments());

          return (
            <>
              <Show when={index() !== 0}>
                <BiSolidChevronRight size="0.6em" />
              </Show>
              <Switch
                fallback={
                  <Unselected onClick={navigate}>
                    {props.renderElement(segments().join("/"))}
                  </Unselected>
                }
              >
                <Match when={index() === props.elements.length - 1}>
                  <Selected>
                    {props.renderElement(segments().join("/"))}
                  </Selected>
                </Match>
              </Switch>
            </>
          );
        }}
      </For>
    </Base>
  );
}

/**
 * Base styles
 */
const Base = styled(Row, {
  base: {
    userSelect: "none",
    color: "var(--colours-component-breadcrumbs-foreground)",
  },
});

/**
 * Unselected styles
 */
const Unselected = styled("div", {
  base: {
    cursor: "pointer",
    transition: "var(--transitions-fast) filter",
    "&:hover": {
      filter: "var(--effects-hover)",
    },
    "&:active": {
      filter: "var(--effects-active)",
    },
  },
});

/**
 * Selected styles
 */
const Selected = styled("div", {
  base: {
    color: "var(--colours-component-breadcrumbs-foreground-active)",
  },
});
