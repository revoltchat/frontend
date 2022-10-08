import { Route, Routes } from "@revolt/routing";
import { Component, lazy } from "solid-js";

const AuthPage = lazy(() => import("./Auth"));
const Interface = lazy(() => import("./Interface"));

/**
 * App routing
 */
const App: Component = () => {
  return (
    <Routes>
      <Route path="/login/*" component={AuthPage} />
      <Route path="/*" component={Interface} />
    </Routes>
  );
};

export default App;
