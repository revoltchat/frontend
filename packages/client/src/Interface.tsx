import { Component, Match, Switch, onCleanup, onMount } from "solid-js";

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
        <Layout
          onDragOver={(e) => {
            if (e.dataTransfer) e.dataTransfer.dropEffect = "none";
          }}
          onDrop={(e) => e.preventDefault()}
        >
          <Sidebar />
          <Content />
        </Layout>
      </Match>
    </Switch>
  );
};

/**
 * Parent container
 */
const Layout = styled("div", "Layout")`
  display: flex;
  height: 100%;
`;

export default Interface;
