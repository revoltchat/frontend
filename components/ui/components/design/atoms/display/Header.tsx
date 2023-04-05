import { styled } from "solid-styled-components";

export interface Props {
  readonly palette: "primary" | "secondary";

  readonly topBorder?: boolean;
  readonly bottomBorder?: boolean;
}

/**
 * Generic header component
 */
export const Header = styled("div", "Header")<Props>`
  gap: 10px;
  flex: 0 auto;
  display: flex;
  flex-shrink: 0;
  padding: 0 16px;
  align-items: center;

  font-weight: 600;
  user-select: none;

  color: ${(props) =>
    props.theme!.colours[
      props.palette === "primary" ? "foreground-200" : "foreground"
    ]};
  height: ${(props) => props.theme!.layout.height.header};

  svg {
    flex-shrink: 0;
  }

  background-size: cover !important;
  background-position: center !important;
  background-color: ${(props) =>
    props.theme!.colours[
      `background-${props.palette === "primary" ? "300" : "200"}`
    ]};

  border-start-start-radius: ${(props) => (props.topBorder ? "8px" : 0)};
  border-end-start-radius: ${(props) => (props.bottomBorder ? "8px" : 0)};
`;

/**
 * Header with background transparency
 */
export const HeaderWithTransparency = styled(Header)`
  background-color: rgba(${(props) => props.theme!.rgb["header"]}, 0.75);
  backdrop-filter: ${(props) => props.theme!.effects.blur.md};

  width: 100%;
  z-index: 20;
  position: absolute;
`;

/**
 * Header with background image
 */
export const HeaderWithImage = styled(Header)`
  padding: 0;
  align-items: flex-end;
  justify-content: stretch;
  text-shadow: 0px 0px 1px black;
  height: ${(props) => props.theme!.layout.height["tall-header"]};

  > * {
    flex-grow: 1;
    padding: 6px 14px;
    background: linear-gradient(
      0deg,
      ${(props) =>
        props.theme!.colours[
          `background-${props.palette === "primary" ? "200" : "100"}`
        ]},
      transparent
    );
  }
`;
