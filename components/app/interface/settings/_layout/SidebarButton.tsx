import { styled } from "@revolt/ui";

// TODO: move to @revolt/ui package

type Props = Record<never, never>;

/**
 * Sidebar button
 */
export const SidebarButton = styled.a<Props>`
  display: flex;
  align-items: center;
  padding: 6px 8px;
  border-radius: 8px;
  font-weight: 500;
  margin-inline-end: 12px;
  font-size: 15px;
  transition: background-color .1s ease-in-out;
  color: ${(props) => props.theme!.colour("onSecondary", 20)};

  svg {
    flex-shrink: 0;
  }

  .title {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-grow: 1;
    padding-inline-end: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    
    .text {
      display: flex;
      flex-direction: column;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .icon {
    display: flex;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex-shrink: 0;
    gap: 2px;
  }

  &:hover {
    background-color: ${(props) => props.theme!.colour("secondary", 90)};
  }

  &:active {
    background-color: ${(props) => props.theme!.colour("secondary", 82)};
  }
`;
