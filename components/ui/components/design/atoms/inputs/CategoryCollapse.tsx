import { ComponentProps, JSX, Match, Switch, createEffect, createSignal, onMount, splitProps } from "solid-js";
import { styled } from "solid-styled-components";

import type { scrollable } from "../../../../directives";
import { Column } from "../../layout";

import { CategoryButton } from "./CategoryButton";

type Props = Omit<
  ComponentProps<typeof CategoryButton>,
  "onClick" | "children"
> & {
  children?: JSX.Element;
  title?: JSX.Element;

  scrollable?: boolean;
};

/**
 * Category button with collapsed children (Fluent)
 */
export function CategoryCollapse(props: Props) {
  const [local, remote] = splitProps(props, ["action", "children"]);

  const [opened, setOpened] = createSignal(false);
  const toggleOpened = () => setOpened(!opened());


  let details: HTMLDivElement;
  let column: HTMLDivElement;

  /* recalculate the column height for transition */
  const updateHeight = () => {
    const calculatedHeight = opened()
      ? Math.min(column.scrollHeight, 340)
      : 0

    column.style.height = `${calculatedHeight}px`;
  }

  createEffect(updateHeight);

  return (
    <Details ref={details!} onClick={toggleOpened} class={opened() ? "open" : undefined}>
      <summary>
        <CategoryButton
          {...remote}
          action={[local.action, "collapse"].flat()}
          onClick={() => void 0}
        >
          {props.title}
        </CategoryButton>
      </summary>
      <Switch fallback={<InnerColumn gap="xs" ref={column!}>{props.children}</InnerColumn>}>
        <Match when={props.scrollable}>
          <StaticInnerColumn gap="xs" ref={column!} use: scrollable>
            {props.children}
          </StaticInnerColumn>
        </Match>
      </Switch>
    </Details>
  );
}

/**
 * Column with inner content
 */
const InnerColumn = styled(Column)`
  border-radius: ${(props) => props.theme!.borderRadius.md};
  transition: 0.3s;

  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`

/**
 * Non-scrollable inner column
 */
const StaticInnerColumn = styled(InnerColumn)`
  overflow: hidden;
`

/**
 * Parent base component
 */
const Details = styled.div`
  summary {
    transition: 0.3s;
  }

  &:not(.open) ${InnerColumn.class} {
    opacity: 0;
    pointer-events: none;
  }

  /* add transition to the icon */
  summary div:last-child svg {
    transition: 0.3s;
  }

  /* rotate chevron when it is open */
  &.open summary div:last-child svg {
    transform: rotate(180deg);
  }

  /* add additional padding between top button and children when it is open */
  &.open summary {
    margin-bottom: ${(props) => props.theme!.gap.xs};
  }

  /* hide the default details component marker */
  summary {
    list-style: none;
  }

  summary::marker,
  summary::-webkit-details-marker {
    display: none;
  }

  /* connect elements vertically */
  > :not(summary) .CategoryButton {
    /* and set child backgrounds */
    background: ${(props) => props.theme!.colour("background", 97)};
  }

  /*> :not(summary) > :last-child.CategoryButton {
    margin-bottom: 8px;
  }*/
`;

