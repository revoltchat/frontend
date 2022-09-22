import { styled } from "solid-styled-components";

export const H4 = styled("h4")`
  margin: 0;
  font-weight: 500;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme!.colours["foreground-100"]};
`;
