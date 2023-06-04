import { styled } from "solid-styled-components";

/**
 * Group a set of category buttons
 */
export const CategoryButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme!.gap.xs};

  /* everything but first element must have no top rounding */
  > :not(:first-child) {
    border-start-start-radius: 0px;
    border-start-end-radius: 0px;
  }

  > :not(:first-child) summary .CategoryButton {
    border-start-start-radius: 0px;
    border-start-end-radius: 0px;
  }

  /* everything but last element must have no bottom rounding */
  > :not(:last-child) {
    border-end-start-radius: 0px;
    border-end-end-radius: 0px;
  }

  > :not(:last-child) summary .CategoryButton {
    border-end-start-radius: 0px;
    border-end-end-radius: 0px;
  }

  /* also consider any nested category collapse components */
  > details:not(:last-child) :not(summary) .CategoryButton:last-child {
    border-end-start-radius: 0px;
    border-end-end-radius: 0px;
  }

  > :not(:last-child) details :not(summary) .CategoryButton:last-child {
    border-end-start-radius: 0px;
    border-end-end-radius: 0px;
  }
`;
