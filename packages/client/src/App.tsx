import { AuthPage } from "@revolt/auth";
import { Route, Routes } from "@solidjs/router";

import { Component } from "solid-js";
import { HomeTesting } from "./HomeTesting";

const App: Component = () => {
  // return <AuthPage />;
  return (
    <Routes>
      <Route path="/login/*" element={<AuthPage />} />
      <Route path="/" element={<HomeTesting />} />
    </Routes>
  );
};

export default App;
