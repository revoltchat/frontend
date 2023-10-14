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
  open?: boolean;
};

/**
 * Category button with collapsed children
 */
export function CategoryCollapse(props: Props) {
  const [local, remote] = splitProps(props, ["action", "children"]);

  return (
    <Details open={props.open}>
      <Summary>
        <CategoryButton
          {...remote}
          action={[local.action, "collapse"].flat()}
          onClick={() => void 0}
        >
          {props.title}
        </CategoryButton>
      </Summary>
      <Column gap="xxs">{props.children}</Column>
    </Details>
  );
}

/**
 * Parent base component
 */
const Details = styled.details`
  &[open] summary svg:last-child {
    transform: rotate(180deg);
  }

  summary {
    list-style: none;
  }

  summary::marker,
  summary::-webkit-details-marker {
    display: none;
  }

  &[open] > summary .CategoryButton {
    border-end-end-radius: 0;
    border-end-start-radius: 0;
  }

  > :not(summary) .CategoryButton {
    border-start-start-radius: 0;
    border-start-end-radius: 0;
  }

  > :not(summary) > :not(:last-child) .CategoryButton {
    border-end-end-radius: 0;
    border-end-start-radius: 0;
  }

  > :not(summary) > :not(:last-child).CategoryButton {
    border-end-end-radius: 0;
    border-end-start-radius: 0;
  }
`;

/**
 * Top button wrapper
 */
const Summary = styled.summary`
  margin-bottom: ${(props) => props.theme!.gap.xxs};

  > * {
    outline-width: 0;
    outline-style: solid;
    outline-color: ${(props) => props.theme!.colours["background-300"]};
  }

  &:hover {
    > * {
      outline-width: 1px;
    }
  }
`;
