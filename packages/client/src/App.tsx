import { Component, onMount } from "solid-js";

import { Navigate, Route, Router } from "@solidjs/router";

import FlowCheck from "@revolt/auth/src/flows/FlowCheck";
import FlowConfirmReset from "@revolt/auth/src/flows/FlowConfirmReset";
import FlowCreate from "@revolt/auth/src/flows/FlowCreate";
import FlowHome from "@revolt/auth/src/flows/FlowHome";
import FlowLogin from "@revolt/auth/src/flows/FlowLogin";
import FlowResend from "@revolt/auth/src/flows/FlowResend";
import FlowReset from "@revolt/auth/src/flows/FlowReset";
import FlowVerify from "@revolt/auth/src/flows/FlowVerify";
import { modalController } from "@revolt/modal";
import { Demo } from "@revolt/rtc/Demo";
import { state } from "@revolt/state";

import AuthPage from "./Auth";
import Interface from "./Interface";
import { Friends } from "./interface/Friends";
import { HomePage } from "./interface/Home";
import { ServerHome } from "./interface/ServerHome";
import { ChannelPage } from "./interface/channels/ChannelPage";

// TODO: code splitting: const Interface = lazy(() => import("./Interface"));

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
  onMount(() => modalController.push({ type: "settings", config: "client" }));
  return <PWARedirect />;
}

/**
 * App routing
 */
const App: Component = () => {
  return (
    <Router>
      <Route path="/login" component={AuthPage as never}>
        <Route path="/check" component={FlowCheck} />
        <Route path="/create" component={FlowCreate} />
        <Route path="/auth" component={FlowLogin} />
        <Route path="/resend" component={FlowResend} />
        <Route path="/reset" component={FlowReset} />
        <Route path="/verify/:token" component={FlowVerify} />
        <Route path="/reset/:token" component={FlowConfirmReset} />
        <Route path="/*" component={FlowHome} />
      </Route>
      <Route path="/rtc" component={Demo} />
      <Route path="/" component={Interface as never}>
        <Route path="/pwa" component={PWARedirect} />
        <Route path="/settings" component={SettingsRedirect} />
        <Route path="/friends" component={Friends} />
        <Route path="/server/:server/*">
          <Route path="/channel/:channel/*" component={ChannelPage} />
          <Route path="/*" component={ServerHome} />
        </Route>
        <Route path="/channel/:channel/*" component={ChannelPage} />
        <Route path="/*" component={HomePage} />
      </Route>
    </Router>
  );
};

export default App;
