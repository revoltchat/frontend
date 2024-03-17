import { Component, Show, Suspense, Switch, lazy } from "solid-js";

import { Route, Routes } from "@revolt/routing";
// import { Button } from "@revolt/ui";
import { Button } from "@revolt/ui/components/design/atoms/inputs/Button";

// const AuthPage = lazy(() => import("./Auth"));
// const Interface = lazy(() => import("./Interface"));
const Chunked = lazy(() => import("./Chunked"));

/*async function Lazy(props: { cb: () => Promise<Component> }) {
  let C: Component;

  return <Show when={false}>
    <C />
  </Show>
}*/

const Test = lazy(async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return { default: () => <h1>hello!</h1> };
});

/**
 * App routing
 */
const App: Component = () => {
  return (
    <>
      <Button>panda css does not break in production :eyes:</Button>
      <Suspense>
        <Test />
      </Suspense>
      <Suspense>
        <Chunked />
      </Suspense>
      {/*<Suspense fallback={<h1>waiting for load...</h1>}>
        <Chunked />
  </Suspense>*/}
    </>
    // <Routes>
    //   <Route path="/login/*" component={AuthPage} />
    //   <Route path="/*" component={Interface} />
    // </Routes>
  );
};

export default App;
