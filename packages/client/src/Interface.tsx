import { Component, Show } from "solid-js";

import { clientController } from "@revolt/client";
import { Navigate } from "@revolt/routing";

import { Content } from "./interface/Content";
import { Sidebar } from "./interface/Sidebar";

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
