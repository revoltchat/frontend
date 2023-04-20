import { Component, Match, Switch } from "solid-js";

import { clientController } from "@revolt/client";
import { Navigate } from "@revolt/routing";

import { Content } from "./interface/Content";
import { Sidebar } from "./interface/Sidebar";

/**
 * Application layout
 */
const Interface: Component = () => {
  /**
   * Check whether we are ready to display the interface
   * @returns Boolean
   */
  const ready = () => clientController.isReady();

  return (
    <Switch fallback={<h1>we appear to be loading; ready:</h1>}>
      <Match when={!clientController.isLoggedIn()}>
        <h1>Redirecting...</h1>
        <Navigate href="/login" />
      </Match>
      <Match when={ready()}>
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
