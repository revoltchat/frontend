import {
  BiRegularInfoSquare,
  BiRegularX,
  BiSolidBell,
  BiSolidMicrophone,
  BiSolidPalette,
  BiSolidShield,
  BiSolidUser,
} from "solid-icons/bi";
import { Show } from "solid-js";
import { Portal } from "solid-js/web";

import { Motion, Presence } from "@motionone/solid";

import { Column, MenuButton, Typography, styled } from "@revolt/ui";

import { PropGenerator } from "../types";

/**
 * Modal to display server information
 */
const Settings: PropGenerator<"settings"> = () => {
  return {
    _children: (props) => {
      return (
        <Portal mount={document.getElementById("floating")!}>
          <div
            style={{
              position: "fixed",
              width: "100%",
              height: "100vh",
              left: 0,
              top: 0,
              "pointer-events": "none",
            }}
          >
            <Presence>
              <Show when={props?.show}>
                <Motion.div
                  style={{
                    height: "100%",
                    "pointer-events": "all",
                    display: "flex",
                  }}
                  initial={{ opacity: 0, scale: 1.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.4 }}
                  transition={{ duration: 0.2, easing: [0.87, 0, 0.13, 1] }}
                >
                  <DesktopLayout onClose={props.onClose} />
                </Motion.div>
              </Show>
            </Presence>
          </div>
        </Portal>
      );
    },
  };
};

/**
 * HOT
 * @param props
 * @returns
 */
function DesktopLayout(props: { onClose: () => void }) {
  return (
    <>
      <Sidebar>
        <SidebarContent>
          <Typography variant="label">Deez Nuts</Typography>
          <Column group="4px" gap="sm">
            <a>
              <MenuButton attention="selected" icon={<BiSolidUser size={20} />}>
                My Account
              </MenuButton>
            </a>
            <a>
              <MenuButton icon={<BiRegularInfoSquare size={20} />}>
                Profile
              </MenuButton>
            </a>
            <a>
              <MenuButton icon={<BiSolidShield size={20} />}>
                Session
              </MenuButton>
            </a>
          </Column>

          <div style={{ height: "12px", "flex-shrink": 0 }} />

          <Typography variant="label">Deez 2</Typography>
          <Column group="4px" gap="sm">
            <a>
              <MenuButton icon={<BiSolidMicrophone size={20} />}>
                Voice Settings
              </MenuButton>
            </a>
            <a>
              <MenuButton icon={<BiSolidPalette size={20} />}>
                Appearance
              </MenuButton>
            </a>
            <a>
              <MenuButton icon={<BiSolidBell size={20} />}>
                Notifications
              </MenuButton>
            </a>
          </Column>
        </SidebarContent>
      </Sidebar>
      <Content>
        <InnerContent>hggf</InnerContent>
        <CloseAction>
          <CloseAnchor onClick={props.onClose}>
            <BiRegularX size={28} color="unset" />
          </CloseAnchor>
        </CloseAction>
      </Content>
    </>
  );
}

const SidebarContent = styled.div`
  min-width: 218px;
  padding: 80px 8px;
  display: flex;
  gap: 2px;
  flex-direction: column;

  a > div {
    margin: 0;
  }
`;

const Sidebar = styled.div`
  flex: 1 0 218px;
  display: flex;
  justify-content: flex-end;
  color: ${(props) => props.theme!.colours["foreground-200"]};
  background: ${(props) => props.theme!.colours["background-100"]};
`;

const Content = styled.div`
  flex: 1 1 800px;
  flex-direction: row;

  display: flex;
  overflow-y: auto;
  background: ${(props) => props.theme!.colours["background-200"]};
`;

const InnerContent = styled.div`
  display: flex;
  gap: 13px;
  max-width: 740px;
  padding: 80px 32px;
  width: 100%;
  flex-direction: column;
`;

const CloseAnchor = styled.a`
  width: 40px;
  height: 40px;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: ${(props) => props.theme!.transitions.fast} background-color;

  border-radius: ${(props) => props.theme!.borderRadius.full};
  border: 3px solid ${(props) => props.theme!.colours["background-400"]};

  svg {
    color: ${(props) => props.theme!.colours["foreground-200"]};
  }

  &:hover {
    background: ${(props) => props.theme!.colours["background-400"]};
  }

  &:active {
    transform: translateY(2px);
  }
`;

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

export default Settings;
