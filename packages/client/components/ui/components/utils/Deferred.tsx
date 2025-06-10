import { Match } from "solid-js";
import { JSX, Switch, createSignal, onMount } from "solid-js";

import { CircularProgress } from "../design";

/**
 * Render component after other elements have been drawn to DOM
 *
 * Use this to make navigation more snappy and load in more heavy components after the fact.
 */
export function Deferred(props: { children: JSX.Element }) {
  const [render, setRender] = createSignal(false);
  onMount(() => setTimeout(() => setRender(true)));
  return (
    <Switch fallback={<CircularProgress />}>
      <Match when={render()}>{props.children}</Match>
    </Switch>
  );
}
