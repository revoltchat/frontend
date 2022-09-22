import { styled } from "solid-styled-components";

export const H5 = styled("h5")`
  margin: 0;
  font-weight: 500;
  font-size: 0.75rem;
  color: ${({ theme }) => theme!.colours["foreground"]};
`;
