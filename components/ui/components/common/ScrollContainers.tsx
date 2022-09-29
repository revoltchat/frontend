import { styled } from "solid-styled-components";

export const ScrollContainer = styled.div<{ offsetTop?: number }>`
  scrollbar-width: thin;
  overflow-y: scroll;
  padding-top: ${(props) => props.offsetTop || 0}px;

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

export const InvisibleScrollContainer = styled(ScrollContainer)`
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;
