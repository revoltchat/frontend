import { clientController } from "@revolt/client";
import { Navigate } from "@revolt/routing";

import { Component } from "solid-js";
import { Sidebar } from "./interface/Sidebar";
import { Content } from "./interface/Content";

const Interface: Component = () => {
  if (!clientController.isLoggedIn()) {
    return <Navigate href="/login" />;
  }

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <Sidebar />
      <Content />
    </div>
  );
};

export default Interface;
