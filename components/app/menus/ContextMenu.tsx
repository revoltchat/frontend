import { styled } from "@revolt/ui";

export const ContextMenu = styled.div`
  display: flex;
  flex-direction: column;

  background: ${(props) => props.theme!.colours.accent};
`;

export const ContextMenuDivider = styled.div``;

export const ContextMenuButton = styled.a`
  margin: 2px;
  display: block;

  background: red;
`;
