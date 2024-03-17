import { Component, Suspense, lazy } from "solid-js";

import { Route, Routes } from "@revolt/routing";
// import { Button } from "@revolt/ui";
import { Button } from "@revolt/ui/components/design/atoms/inputs/Button";

// const AuthPage = lazy(() => import("./Auth"));
// const Interface = lazy(() => import("./Interface"));
const Chunked = lazy(() => import("./Chunked"));

/**
 * App routing
 */
const App: Component = () => {
  return (
    <>
      <Button>panda css does not break in production :eyes:</Button>
      <Suspense fallback={<h1>waiting for load...</h1>}>
        <Chunked />
      </Suspense>
    </>
    // <Routes>
    //   <Route path="/login/*" component={AuthPage} />
    //   <Route path="/*" component={Interface} />
    // </Routes>
  );
};

export default App;
