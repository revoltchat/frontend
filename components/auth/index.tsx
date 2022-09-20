/// <reference path="../../types/styled.d.ts" />

export { AuthPage } from "./src/AuthPage";

import { H1 } from "@revolt/ui";

import HCaptcha, { HCaptchaFunctions } from "solid-hcaptcha";

export function Test() {
  /*let hcaptcha: HCaptchaFunctions | undefined;

  const submitCaptcha = async () => {
    if (!hcaptcha) return; // Check if the widget has loaded.

    // Execute the captcha and get the response.
    const response = await hcaptcha.execute();

    console.log("stored response", response);
  };*/

  return (
    <>
      <H1>Login</H1>
      {/*<HCaptcha
        sitekey="3daae85e-09ab-4ff6-9f24-e8f4f335e433"
        onLoad={(hcaptcha_instance) => (hcaptcha = hcaptcha_instance)}
        size="invisible"
      />
  <button onClick={submitCaptcha}>Open captcha</button>*/}
    </>
  );
}
