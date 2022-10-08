import { styled } from "solid-styled-components";

/**
 * Basic scroll container with correct styling
 */
export const ScrollContainer = styled.div<{
  offsetTop?: number;
  scrollDirection?: "x" | "y";
}>`
  flex-grow: 1;
  min-width: 0;
  min-height: 0;
  scrollbar-width: thin;
  padding-top: ${(props) => props.offsetTop || 0}px;
  ${(props) => `overflow-${props.scrollDirection ?? "y"}`}: scroll;

  &::-webkit-scrollbar {
    width: 7px;
    height: 7px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    min-width: 30px;
    min-height: 30px;

    background: ${({ theme }) => theme!.colours["accent"]};
    background-clip: content-box;

    border-top: ${(props) => props.offsetTop || 0}px solid transparent;
  }
`;

/**
 * Scroll container with no visible track
 */
export const InvisibleScrollContainer = styled(ScrollContainer)`
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;
