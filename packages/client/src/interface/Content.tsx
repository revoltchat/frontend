import { Component } from "solid-js";
import { ChannelPage } from "./channels/ChannelPage";
import { Route, Routes } from "@revolt/routing";

import { DevelopmentPage } from "./Development";

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
            <Route path="/*" element={<span>server!</span>} />
          </Routes>
        }
      />
      <Route path="/channel/:channel" component={ChannelPage} />
      <Route path="/dev" element={<DevelopmentPage />} />
      <Route path="/*" element={<span>home page</span>} />
    </Routes>
  );
};
