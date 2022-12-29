import { clientController } from "@revolt/client";
import { Navigate } from "@revolt/routing";

import { Component, Show } from "solid-js";
import { Sidebar } from "./interface/Sidebar";
import { Content } from "./interface/Content";

/**
 * Application layout
 */
const Interface: Component = () => {
  if (!clientController.isLoggedIn()) {
    return <Navigate href="/login" />;
  }

  return (
    <Show when={clientController.isReady()}>
      <div
        style={{
          display: "flex",
          height: "100%",
          "overflow-x": "auto",
          "scroll-snap-type": "x mandatory",
        }}
      >
        <Sidebar />
        <Content />
      </div>
    </Show>
  );
};

export default Interface;
