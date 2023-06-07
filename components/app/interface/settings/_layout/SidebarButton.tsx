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
  margin-inline-end: 12px;
  font-size: 15px;
  transition: background-color .1s ease-in-out;

  svg {
    flex-shrink: 0;
  }

  &:hover {
    background-color: ${(props) => props.theme!.colour("secondary", 90)};
  }
`;
