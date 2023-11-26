import { Component, onMount } from "solid-js";

import { modalController } from "@revolt/modal";
import { Navigate, Route, Routes } from "@revolt/routing";
import { state } from "@revolt/state";

import { DevelopmentPage } from "./Development";
import { Friends } from "./Friends";
import { HomePage } from "./Home";
import { ServerHome } from "./ServerHome";
import { ChannelPage } from "./channels/ChannelPage";

/**
 * Redirect PWA start to the last active path
 */
function PWARedirect() {
  return <Navigate href={state.layout.getLastActivePath()} />;
}

/**
 * Open settings and redirect to last active path
 */
function SettingsRedirect() {
  onMount(() => modalController.push({ type: "settings" }));
  return <PWARedirect />;
}

/**
 * Render content without sidebars
 */
export const Content: Component = () => {
  return <ChannelPage />;
};
