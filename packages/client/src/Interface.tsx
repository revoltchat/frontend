import { Component, Match, Switch } from "solid-js";

import { clientController } from "@revolt/client";
import { Navigate } from "@revolt/routing";
import { Preloader } from "@revolt/ui";

import { Content } from "./interface/Content";
import { Sidebar } from "./interface/Sidebar";

/**
 * Application layout
 */
const Interface: Component = () => {
  return (
    <Switch fallback={<Preloader grow type="spinner" />}>
      <Match when={!clientController.isLoggedIn()}>
        <Navigate href="/login" />
      </Match>
      <Match when={clientController.isReady()}>
        <div
          style={{
            display: "flex",
            height: "100%",
            "overflow-x": "auto",
            "scroll-snap-type": "x mandatory",
          }}
          onDragOver={(e) => {
            if (e.dataTransfer) e.dataTransfer.dropEffect = "none";
          }}
          onDrop={(e) => e.preventDefault()}
        >
          <Sidebar />
          <Content />
        </div>
      </Match>
    </Switch>
  );
};

export default Interface;
