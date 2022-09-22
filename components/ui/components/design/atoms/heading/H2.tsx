import { styled } from "solid-styled-components";

export const H2 = styled("h2")`
  margin: 0;
  font-weight: 700;
  font-size: 0.9375rem;
  color: ${({ theme }) => theme!.colours.foreground};
`;
