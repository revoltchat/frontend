import { Component, Match, Switch } from "solid-js";

import { useParams } from "@revolt/routing";

import { HomePage } from "./Home";
import { ServerHome } from "./ServerHome";
import { ChannelPage } from "./channels/ChannelPage";

/**
 * Render content without sidebars
 */
export const Content: Component = () => {
  const params = useParams<{
    server?: string;
    channel?: string;
    any?: string;
  }>();

  return (
    <Switch fallback={<HomePage />}>
      <Match when={params.channel}>
        <ChannelPage />
      </Match>
      <Match when={params.server}>
        <ServerHome />
      </Match>
    </Switch>
  );

  /*return (
    <>
      <Route
        path="/server/:server/*"
        element={
          <>
            <Route path="/channel/:channel/*" component={ChannelPage} />
            <Route path="/*" component={ServerHome} />
          </>
        }
      />
      <Route path="/channel/:channel/*" component={ChannelPage} />
      <Route path="/dev" component={DevelopmentPage} />
      <Route path="/friends" component={Friends} />
      <Route path="/app" component={HomePage} />
      <Route path="/" element={<Navigate href="/app" />} />
    </>
  );*/
};
