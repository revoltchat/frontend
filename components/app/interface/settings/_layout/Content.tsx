import { BiRegularX } from "solid-icons/bi";
import { Accessor, JSX, Show } from "solid-js";

import { Breadcrumbs, Column, Typography, styled } from "@revolt/ui";

import { useSettingsNavigation } from "../Settings";

/**
 * Content portion of the settings menu
 */
export function SettingsContent(props: {
  onClose?: () => void;
  children: JSX.Element;
  title: (key: string) => string;
  page: Accessor<string | undefined>;
}) {
  const { navigate } = useSettingsNavigation();

  return (
    <Base>
      <Show when={props.page()}>
        <InnerContentBackground />
        <InnerContent>
          <InnerColumn gap="x">
            <Typography variant="settings-title">
              <Breadcrumbs
                elements={props.page()!.split("/")}
                renderElement={(key) => props.title(key)}
                navigate={(keys) => navigate(keys.join("/"))}
              />
            </Typography>
            {props.children}
          </InnerColumn>
        </InnerContent>
      </Show>
      <Show when={props.onClose}>
        <CloseAction>
          <CloseAnchor onClick={props.onClose}>
            <BiRegularX size={28} color="unset" />
          </CloseAnchor>
        </CloseAction>
      </Show>
    </Base>
  );
}

/**
 * Base styles
 */
const Base = styled("div", "Content")`
  min-width: 0;
  flex: 1 1 800px;
  flex-direction: row;

  display: flex;
  overflow-y: scroll;
  overflow-x: hidden;
  background: ${(props) => props.theme!.colour("secondary", 96)};

  /* just to avoid headaches with styling individual links */
  a {
    text-decoration: none;
  }
`;

/**
 * Settings pane
 */
const InnerContent = styled("div", "Pane")`
  gap: 13px;
  min-width: 0;
  width: 100%;
  display: flex;
  max-width: 740px;
  padding: 80px 32px;
  justify-content: stretch;
  z-index: 1;
`;

/**
 * Settings styled background
 */
const InnerContentBackground = styled("div", "PaneBackground")`
  width: 100%;
  height: 100vh;
  position: fixed;
  background: ${(props) => props.theme!.colour("secondary", 92)};

  border-start-start-radius: 30px;
  border-end-start-radius: 30px;
`;

/**
 * Pane content column
 */
const InnerColumn = styled(Column)`
  width: 100%;
`;

/**
 * Button for closing settings page
 */
const CloseAnchor = styled.a`
  width: 36px;
  height: 36px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: ${(props) => props.theme!.borderRadius.full};
  border: 3px solid ${(props) => props.theme!.colour("primary")};
  transition: ${(props) => props.theme!.transitions.fast} background-color;

  svg {
    transition: ${(props) => props.theme!.transitions.fast} background-color;
    color: ${(props) => props.theme!.colour("primary")} !important;
  }

  &:hover {
    background: ${(props) => props.theme!.colour("primary")};
  }

  &:hover svg {
    color: ${(props) => props.theme!.colour("onPrimary")} !important;
  }

  &:active {
    transform: translateY(2px);
  }
`;

/**
 * Positioning for close button
 */
const CloseAction = styled.div`
  flex-grow: 1;
  flex-shrink: 0;
  padding: 80px 8px;
  visibility: visible;
  position: sticky;
  top: 0;
  background: ${(props) => props.theme!.colour("secondary", 92)};

  &:after {
    content: "ESC";
    margin-top: 4px;
    display: flex;
    justify-content: center;
    width: 36px;
    font-weight: 600;
    color: ${(props) => props.theme!.colour("primary")};
    font-size: 0.75rem;
  }
`;
