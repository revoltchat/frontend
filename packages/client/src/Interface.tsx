import { Component, Match, Switch, onCleanup, onMount } from "solid-js";

import { Server } from "revolt.js";

import { ChannelContextMenu, ServerContextMenu } from "@revolt/app";
import { clientController } from "@revolt/client";
import { KeybindAction } from "@revolt/keybinds";
import { modalController } from "@revolt/modal";
import { Navigate, useBeforeLeave } from "@revolt/routing";
import { state } from "@revolt/state";
import { Preloader, styled } from "@revolt/ui";
import { useKeybindActions } from "@revolt/ui/components/context/Keybinds";

import { Content } from "./interface/Content";
import { Sidebar } from "./interface/Sidebar";

/**
 * Application layout
 */
const Interface: Component = () => {
  const keybinds = useKeybindActions();

  useBeforeLeave((e) => {
    if (!e.defaultPrevented) {
      if (e.to === "/settings") {
        e.preventDefault();
        modalController.push({
          type: "settings",
          config: "client",
        });
      } else if (typeof e.to === "string") {
        state.layout.setLastActivePath(e.to);
      }
    }
  });

  onMount(() => {
    keybinds.addEventListener(
      KeybindAction.DeveloperToggleAllExperiments,
      state.experiments.toggleSafeMode
    );
  });

  onCleanup(() => {
    keybinds.removeEventListener(
      KeybindAction.DeveloperToggleAllExperiments,
      state.experiments.toggleSafeMode
    );
  });

  return (
    <Switch fallback={<Preloader grow type="spinner" />}>
      <Match when={!clientController.isLoggedIn()}>
        <Navigate href="/login" />
      </Match>
      <Match when={clientController.isReady()}>
        <div
          style={{
            display: "flex",
            "flex-direction": "column",
            height: "100%",
          }}
        >
          <Notice>⚠️ This is beta software, things will break!</Notice>
          <Layout
            style={{ "flex-grow": 1, "min-height": 0 }}
            onDragOver={(e) => {
              if (e.dataTransfer) e.dataTransfer.dropEffect = "none";
            }}
            onDrop={(e) => e.preventDefault()}
          >
            <Sidebar
              menuGenerator={(target) => ({
                contextMenu: () => {
                  return (
                    <>
                      {target instanceof Server ? (
                        <ServerContextMenu server={target} />
                      ) : (
                        <ChannelContextMenu channel={target} />
                      )}
                    </>
                  );
                },
              })}
            />
            <Content />
          </Layout>
        </div>
      </Match>
    </Switch>
  );
};

const Notice = styled.div`
  text-align: center;
  font-size: 0.8em;
  margin: ${(props) => props.theme!.gap.md} ${(props) => props.theme!.gap.md} 0
    ${(props) => props.theme!.gap.md};
  padding: ${(props) => props.theme!.gap.md};
  background: ${(props) =>
    props.theme!.colours["messaging-message-box-background"]};
  color: ${(props) => props.theme!.colours["messaging-message-box-foreground"]};
  border-radius: ${(props) => props.theme!.borderRadius.md};
`;

/**
 * Parent container
 */
const Layout = styled("div", "Layout")`
  display: flex;
  height: 100%;
`;

export default Interface;
