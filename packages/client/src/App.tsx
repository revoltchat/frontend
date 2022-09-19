import { Test } from "@revolt/auth";
import { H1 } from "@revolt/ui";

import type { Component } from "solid-js";

const App: Component = () => {
  return (
    <div>
      <H1>
        hello! <Test />
      </H1>
    </div>
  );
};

export default App;
