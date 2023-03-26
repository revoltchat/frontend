import { Component, lazy } from "solid-js";

import { Route, Routes } from "@revolt/routing";

import { DevelopmentPage } from "./Development";
import { HomePage } from "./Home";
import { ServerHome } from "./ServerHome";
import { ChannelPage } from "./channels/ChannelPage";

const Admin = lazy(() => import("@revolt/admin"));

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
      <Route path="/dev" element={<DevelopmentPage />} />
      <Route path="/admin" component={Admin} />
      <Route path="/*" element={<HomePage />} />
    </Routes>
  );
};
