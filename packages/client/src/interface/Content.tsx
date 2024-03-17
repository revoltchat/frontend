import { Component, onMount } from "solid-js";

import { modalController } from "@revolt/modal";
import { Navigate, Route, Routes } from "@revolt/routing";
import { state } from "@revolt/state";

import { DevelopmentPage } from "./Development";
import { Friends } from "./Friends";
import { HomePage } from "./Home";
import { ServerHome } from "./ServerHome";
import { ChannelPage } from "./channels/ChannelPage";

/**
 * Redirect PWA start to the last active path
 */
function PWARedirect() {
  return <Navigate href={state.layout.getLastActivePath()} />;
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
            <Route path="/channel/:channel/*" component={ChannelPage} />
            <Route path="/*" component={ServerHome} />
          </Routes>
        }
      />
      <Route path="/channel/:channel/*" component={ChannelPage} />
      <Route path="/dev" component={DevelopmentPage} />
      <Route path="/friends" component={Friends} />
      <Route path="/app" component={HomePage} />
      <Route path="/pwa" component={PWARedirect} />
      <Route path="/settings" component={SettingsRedirect} />
      <Route path="/" element={<Navigate href="/app" />} />
    </Routes>
  );
};
