/* @refresh reload */
import "@revolt/ui/styles.css";

/**
 * Configure contexts and render App
 */
import { render } from "solid-js/web";

import {
  H1,
  H2,
  H3,
  H4,
  H5,
  ThemeProvider,
  darkTheme,
  Masks,
  Avatar,
  UserStatus,
} from "@revolt/ui";

render(
  () => (
    <div style={{ background: "#111", height: "100%" }}>
      <Masks />
      <ThemeProvider theme={darkTheme}>
        <H1>hello!</H1>
        <H2>hello!</H2>
        <H3>hello!</H3>
        <H4>hello!</H4>
        <H5>hello!</H5>
        <Avatar
          size={64}
          fallback="deez nuts"
          holepunch="bottom-right"
          overlay={<UserStatus status="online" />}
          interactive
        />
      </ThemeProvider>
    </div>
  ),
  document.getElementById("root") as HTMLElement
);
