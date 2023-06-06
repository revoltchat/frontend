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
        <InnerContent>
          <InnerColumn gap="xl">
            <Typography variant="settings-title">
              <Breadcrumbs
                elements={props.page()!.split("/")}
                renderElement={(key) => props.title(key)}
                navigate={(keys) => navigate(keys.join("/"))}
              />
            </Typography>
            {props.children}
            <BottomPadding />
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
  flex: 1 1 800px;
  flex-direction: row;

  display: flex;
  overflow-y: scroll;
  overflow-x: hidden;
  background: ${(props) => props.theme!.colour("secondary", 90)};
`;

/**
 * Settings pane
 */
const InnerContent = styled("div", "Pane")`
  gap: 13px;
  width: 100%;
  display: flex;
  max-width: 740px;
  padding: 80px 32px;
  justify-content: stretch;
`;

/**
 * Pane content column
 */
const InnerColumn = styled(Column)`
  width: 100%;
`;

/**
 * Additional padding for bottom of page column
 */
const BottomPadding = styled.div`
  height: 80px;
  flex-shrink: 0;
`;

/**
 * Button for closing settings page
 */
const CloseAnchor = styled.a`
  width: 40px;
  height: 40px;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: ${(props) => props.theme!.borderRadius.full};
  border: 3px solid ${(props) => props.theme!.scheme.primary};
  transition: ${(props) => props.theme!.transitions.fast} background-color;

  svg {
    transition: ${(props) => props.theme!.transitions.fast} background-color;
    color: ${(props) => props.theme!.scheme.primary} !important;
  }

  &:hover {
    background: ${(props) => props.theme!.scheme.primary};
  }

  &:hover svg {
    color: ${(props) => props.theme!.scheme.onPrimary} !important;
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
  padding: 80px 8px;
  visibility: visible;
  position: sticky;
  top: 0;

  &:after {
    content: "ESC";
    margin-top: 4px;
    display: flex;
    justify-content: center;
    width: 40px;
    opacity: 0.5;
    font-size: 0.75rem;
  }
`;
