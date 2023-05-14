import { styled } from "solid-styled-components";

export const SidebarBase = styled("div", "Sidebar")`
  width: 232px;
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  /* flex-direction: row; */
  background: ${({ theme }) => theme!.colours["background-100"]};

  a {
    text-decoration: none;
  }

  > div {
    flex-grow: 1;
  }
`;
