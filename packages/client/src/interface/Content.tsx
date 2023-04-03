import { Component, lazy } from "solid-js";

import { Navigate, Route, Routes } from "@revolt/routing";
import { state } from "@revolt/state";

import { DevelopmentPage } from "./Development";
import { HomePage } from "./Home";
import { ServerHome } from "./ServerHome";
import { ChannelPage } from "./channels/ChannelPage";

const Admin = lazy(() => import("@revolt/admin"));

/**
 * Redirect PWA start to the last active path
 */
function PWARedirect() {
  return <Navigate href={state.layout.getLastActivePath()} />;
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
      <Route path="/channel/:channel" component={ChannelPage} />
      <Route path="/dev" component={DevelopmentPage} />
      <Route path="/admin" component={Admin} />
      <Route path="/app" component={HomePage} />
      <Route path="/pwa" component={PWARedirect} />
      <Route path="/" element={<Navigate href="/app" />} />
    </Routes>
  );
};
