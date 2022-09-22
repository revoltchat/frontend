import { styled } from "solid-styled-components";

export const H3 = styled("h3")`
  margin: 0;
  font-weight: 700;
  font-size: 0.75rem;
  color: ${({ theme }) => theme!.colours["foreground-100"]};
`;
