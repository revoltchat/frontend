import { Component, Match, Switch, createSignal } from "solid-js";

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

  const [yes, doIt] = createSignal(false);

  return (
    <Switch
      fallback={
        <h1>
          we appear to be loading; ready:{" "}
          {clientController.isReady() ? "yes" : "no"}; ready:{" "}
          {ready() ? "yes" : "no"}; logged in:{" "}
          {clientController.isLoggedIn() ? "yes" : "no"}; do we have a client?{" "}
          {"" + clientController.getCurrentClient()}; direct call(
          {"" + clientController.getCurrentClient()?.ready}) ={" "}
          {"" + clientController.getCurrentClient()?.ready()}
          <br />
          <button onClick={() => doIt(true)}>open sesame</button>
        </h1>
      }
    >
      <Match when={!clientController.isLoggedIn()}>
        <h1>Redirecting...</h1>
        <Navigate href="/login" />
      </Match>
      <Match when={yes() || ready()}>
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
