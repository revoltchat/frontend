import { ChannelPage } from "./channels";
import { Component } from "solid-js";
import { Route, Routes } from "@revolt/routing";

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
      <Route path="/*" element={<span>home page</span>} />
    </Routes>
  );
};
