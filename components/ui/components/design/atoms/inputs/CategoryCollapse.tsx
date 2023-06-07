import { ComponentProps, JSX, Match, Switch, splitProps } from "solid-js";
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

  return (
    <Details>
      <summary>
        <CategoryButton
          {...remote}
          action={[local.action, "collapse"].flat()}
          onClick={() => void 0}
        >
          {props.title}
        </CategoryButton>
      </summary>
      <Switch fallback={<Column gap="xs">{props.children}</Column>}>
        <Match when={props.scrollable}>
          <HeightLimitedColumn gap="xs" use:scrollable>
            {props.children}
          </HeightLimitedColumn>
        </Match>
      </Switch>
    </Details>
  );
}

/**
 * Parent base component
 */
const Details = styled.details`
  /* rotate chevron when it is open */
  &[open] summary svg:last-child {
    transform: rotate(180deg);
  }

  /* add additional padding between top button and children when it is open */
  &[open] summary {
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

/**
 * Height-limited column
 */
const HeightLimitedColumn = styled(Column)`
  max-height: 340px;
`;
