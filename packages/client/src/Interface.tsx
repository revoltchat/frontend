import { Component, Show } from "solid-js";

import { clientController } from "@revolt/client";
import { Navigate } from "@revolt/routing";

import { Content } from "./interface/Content";
import { Sidebar } from "./interface/Sidebar";

/**
 * Application layout
 */
const Interface: Component = () => {
  return (
    <>
      <h1>interface</h1>
      <Show when={clientController.isLoggedIn()}>
        <h1>logged in</h1>
      </Show>
      <Show when={!clientController.isLoggedIn()}>
        <h1>logged out</h1>
      </Show>
      <Show when={!clientController.isReady()}>
        <h1>ready</h1>
      </Show>
      <Show when={!clientController.isLoggedIn()}>
        <Navigate href="/login" />
      </Show>
      <Show when={clientController.isReady()}>
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
      </Show>
    </>
  );
};

export default Interface;
