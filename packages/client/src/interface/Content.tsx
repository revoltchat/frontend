import { Component, Show, onMount } from "solid-js";

import { useClient } from "@revolt/client";
import { modalController } from "@revolt/modal";
import { Navigate, Route, Routes } from "@revolt/routing";
import { state } from "@revolt/state";

import { ServerHome } from "./ServerHome";
import { ChannelPage } from "./channels/ChannelPage";

/**
 * Redirect PWA start to the last active path
 */
function PWARedirect() {
  return <Navigate href={state.layout.getLastActivePath()} />;
}

/**
 * Demo redirect
 */
function DemoRedirect() {
  const client = useClient();

  onMount(() => {
    if (!client().servers.has("01F7ZSBSFHQ8TA81725KQCSDDP")) {
      modalController.push({
        type: "demo",
        client: client(),
      });
    }
  });

  return (
    <Show when={client().servers.has("01F7ZSBSFHQ8TA81725KQCSDDP")}>
      <Navigate href="/server/01F7ZSBSFHQ8TA81725KQCSDDP" />
    </Show>
  );
}

/**
 * Open settings and redirect to last active path
 */
function SettingsRedirect() {
  onMount(() => modalController.push({ type: "settings" }));
  return <PWARedirect />;
}

/**
 * Render content without sidebars
 */
export const Content: Component = () => {
  return (
    <Routes>
      <Route
        path="/server/:server/*"
        element={
          <Routes>
            <Route path="/channel/:channel" component={ChannelPage} />
            <Route path="/*" component={ServerHome} />
          </Routes>
        }
      />
      {/* <Route path="/channel/:channel" component={ChannelPage} /> */}
      {/* <Route path="/dev" component={DevelopmentPage} /> */}
      {/* <Route path="/friends" component={Friends} /> */}
      <Route path="/app" component={DemoRedirect} />
      {/* <Route path="/pwa" component={PWARedirect} /> */}
      <Route path="/settings" component={SettingsRedirect} />
      <Route path="/" element={<Navigate href="/app" />} />
    </Routes>
  );
};
