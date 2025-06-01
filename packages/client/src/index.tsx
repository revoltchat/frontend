/**
 * Configure contexts and render App
 */
import { JSX, Show, createEffect, createSignal, on, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { render } from "solid-js/web";

import { attachDevtoolsOverlay } from "@solid-devtools/overlay";
import { Navigate, Route, Router } from "@solidjs/router";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { isTauri } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";
import "mdui/mdui.css";

import FlowCheck from "@revolt/auth/src/flows/FlowCheck";
import FlowConfirmReset from "@revolt/auth/src/flows/FlowConfirmReset";
import FlowCreate from "@revolt/auth/src/flows/FlowCreate";
import FlowHome from "@revolt/auth/src/flows/FlowHome";
import FlowLogin from "@revolt/auth/src/flows/FlowLogin";
import FlowResend from "@revolt/auth/src/flows/FlowResend";
import FlowReset from "@revolt/auth/src/flows/FlowReset";
import FlowVerify from "@revolt/auth/src/flows/FlowVerify";
import { ClientContext } from "@revolt/client";
import { I18nProvider } from "@revolt/i18n";
import { ModalContext, ModalRenderer, useModals } from "@revolt/modal";
import { VoiceContext } from "@revolt/rtc";
import { StateContext, SyncWorker, useState } from "@revolt/state";
import {
  ApplyGlobalStyles,
  FloatingManager,
  KeybindsProvider,
  Masks,
  Titlebar,
  darkTheme,
} from "@revolt/ui";
/* @refresh reload */
import "@revolt/ui/styles";

import AuthPage from "./Auth";
import Interface from "./Interface";
import "./index.css";
import { ConfirmDelete } from "./interface/ConfirmDelete";
import { DevelopmentPage } from "./interface/Development";
import { Friends } from "./interface/Friends";
import { HomePage } from "./interface/Home";
import { ServerHome } from "./interface/ServerHome";
import { ChannelPage } from "./interface/channels/ChannelPage";
import "./sentry";
import { registerKeybindsWithPriority } from "./shared/lib/priorityKeybind";

attachDevtoolsOverlay();

/** TEMPORARY */
function MountTheme(props: { children: any }) {
  const [accent, setAccent] = createSignal("#FF5733");
  const [darkMode, setDarkMode] = createSignal(false);

  (window as any)._demo_setAccent = setAccent;
  (window as any)._demo_setDarkMode = setDarkMode;

  const [theme, setTheme] = createStore(darkTheme(accent(), darkMode()));

  createEffect(
    on(
      () => [accent(), darkMode()] as [string, boolean],
      ([accent, darkMode]) => setTheme(darkTheme(accent, darkMode)),
    ),
  );

  return (
    <>
      {props.children}
      <ApplyGlobalStyles theme={theme} />
    </>
  );
}
/** END TEMPORARY */

/**
 * Redirect PWA start to the last active path
 */
function PWARedirect() {
  const state = useState();
  return <Navigate href={state.layout.getLastActivePath()} />;
}

/**
 * Open settings and redirect to last active path
 */
function SettingsRedirect() {
  const { openModal } = useModals();

  onMount(() => openModal({ type: "settings", config: "user" }));
  return <PWARedirect />;
}

function MountContext(props: { children?: JSX.Element }) {
  const state = useState();
  const appWindow = isTauri() ? getCurrentWindow() : null;

  /**
   * Tanstack Query client
   */
  const client = new QueryClient();

  return (
    <ClientContext state={state}>
      <ModalContext>
        <VoiceContext>
          <I18nProvider>
            <QueryClientProvider client={client}>
              <MountTheme>
                <KeybindsProvider keybinds={() => state.keybinds.getKeybinds()}>
                  <Show when={window.__TAURI__}>
                    <Titlebar
                      isBuildDev={import.meta.env.DEV}
                      onMinimize={() => appWindow?.minimize?.()}
                      onMaximize={() => appWindow?.toggleMaximize?.()}
                      onClose={() => appWindow?.hide?.()}
                    />
                  </Show>
                  {props.children}
                </KeybindsProvider>
                <ModalRenderer />
                <FloatingManager />
              </MountTheme>
            </QueryClientProvider>
          </I18nProvider>
        </VoiceContext>
      </ModalContext>
      <SyncWorker />
    </ClientContext>
  );
}

registerKeybindsWithPriority();

render(
  () => (
    <StateContext>
      <Router root={MountContext}>
        <Route path="/login" component={AuthPage as never}>
          <Route path="/delete/:token" component={ConfirmDelete} />
          <Route path="/check" component={FlowCheck} />
          <Route path="/create" component={FlowCreate} />
          <Route path="/auth" component={FlowLogin} />
          <Route path="/resend" component={FlowResend} />
          <Route path="/reset" component={FlowReset} />
          <Route path="/verify/:token" component={FlowVerify} />
          <Route path="/reset/:token" component={FlowConfirmReset} />
          <Route path="/*" component={FlowHome} />
        </Route>
        <Route path="/" component={Interface as never}>
          <Route path="/pwa" component={PWARedirect} />
          <Route path="/dev" component={DevelopmentPage} />
          <Route path="/settings" component={SettingsRedirect} />
          <Route path="/friends" component={Friends} />
          <Route path="/server/:server/*">
            <Route path="/channel/:channel/*" component={ChannelPage} />
            <Route path="/*" component={ServerHome} />
          </Route>
          <Route path="/channel/:channel/*" component={ChannelPage} />
          <Route path="/*" component={HomePage} />
        </Route>
      </Router>

      <Masks />
    </StateContext>
  ),
  document.getElementById("root") as HTMLElement,
);
