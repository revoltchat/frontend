import { styled } from "solid-styled-components";

export const H1 = styled("h1")`
  margin: 0;
  line-height: 1rem;

  font-weight: 600;
  font-size: 1.2rem;
  color: ${({ theme }) => theme!.colours.foreground};
`;
