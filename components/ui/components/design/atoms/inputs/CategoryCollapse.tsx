import { ComponentProps, JSX, splitProps } from "solid-js";
import { styled } from "solid-styled-components";

import { Column } from "../../layout";

import { CategoryButton } from "./CategoryButton";

type Props = Omit<
  ComponentProps<typeof CategoryButton>,
  "onClick" | "children"
> & {
  children?: JSX.Element;
  title?: JSX.Element;
};

/**
 * Category button with collapsed children (Fluent)
 */
export function CategoryCollapse(props: Props) {
  const [local, remote] = splitProps(props, ["action", "children"]);

  return (
    <Details>
      <Summary>
        <CategoryButton
          {...remote}
          action={[local.action, "collapse"].flat()}
          onClick={() => void 0}
        >
          {props.title}
        </CategoryButton>
      </Summary>
      <Column gap="xs">{props.children}</Column>
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
 * Top button wrapper
 */
const Summary = styled.summary`
  > * {
    outline-width: 0;
    outline-style: solid;
    outline-color: ${(props) => props.theme!.colours["background-300"]};
  }
`;
