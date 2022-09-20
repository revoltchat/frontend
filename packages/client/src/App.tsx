import { AuthPage } from "@revolt/auth";
import { Route, Routes } from "@solidjs/router";

import { Component } from "solid-js";

const App: Component = () => {
  // return <AuthPage />;
  return (
    <Routes>
      <Route path="/login/*" element={<AuthPage />} />
      <Route path="/" element={<div>hello</div>} />
    </Routes>
  );
};

export default App;
