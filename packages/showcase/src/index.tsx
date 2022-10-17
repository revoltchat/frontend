/* @refresh reload */
import "@revolt/ui/styles";

/**
 * Configure contexts and render App
 */
import { render } from "solid-js/web";

import { ThemeProvider, darkTheme, Masks, TooltipDemo } from "@revolt/ui";

render(
  () => (
    <div style={{ background: "#111", height: "100%" }}>
      <Masks />
      <ThemeProvider theme={darkTheme}>
        {/*<H1>hello!</H1>
        <H2>hello!</H2>
        <H3>hello!</H3>
        <H4>hello!</H4>
        <H5>hello!</H5>
        <Preloader type="spinner" />
        <Preloader type="ring" />
        <Turbo />
        <SaveStatus status="editing" />
        <Avatar
          size={64}
          fallback="deez nuts"
          holepunch="right"
          overlay={
            <>
              <UserStatus status="Online" />
              <Unreads count={0} unread />
            </>
          }
          interactive
        />*/}
        <TooltipDemo />
      </ThemeProvider>
    </div>
  ),
  document.getElementById("root") as HTMLElement
);
