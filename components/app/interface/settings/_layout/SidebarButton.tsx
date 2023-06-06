import { styled } from "@revolt/ui";

// TODO: move to @revolt/ui package

type Props = Record<never, never>;

/**
 * Sidebar button
 */
export const SidebarButton = styled.a<Props>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 8px;
  font-weight: 500;
  margin-right: 12px;
  font-size: 15px;

  &:hover {
    background: ${(props) => props.theme!.colour("secondary", 90)};
  }
`;
