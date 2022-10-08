import { styled } from "solid-styled-components";
import { ScrollContainer } from "../../common/ScrollContainers";

export const SidebarBase = styled(ScrollContainer)`
  width: 232px;
  background: ${({ theme }) => theme!.colours["background-100"]};

  a {
    text-decoration: none;
  }
`;
