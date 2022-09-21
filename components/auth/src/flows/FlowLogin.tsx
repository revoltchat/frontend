import { clientController } from "@revolt/client";
import HCaptcha, { HCaptchaFunctions } from "solid-hcaptcha";
import { createSignal, Show } from "solid-js";

export default function FlowLogin() {
  let hcaptcha: HCaptchaFunctions | undefined;

  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");

  const [error, setError] = createSignal<string | undefined>();

  const login = async () => {
    if (!email() || !password()) {
      setError("no email or password");
      return;
    }

    if (!hcaptcha) {
      setError("hCaptcha has not loaded");
      return;
    }

    try {
      const response = await hcaptcha.execute();

      try {
        await clientController.login({
          email: email(),
          password: password(),
          captcha: response!.response,
        });
      } catch (err) {
        setError("login failed");
      }
    } catch (err) {
      setError("hCaptcha cancelled or failed");
    }
  };

  return (
    <div>
      <p>login</p>
      <input
        placeholder="email"
        onInput={(e) => setEmail(e.currentTarget.value)}
      />
      <input
        placeholder="password"
        onInput={(e) => setPassword(e.currentTarget.value)}
      />
      <button onClick={login}>login</button>
      <Show when={error()}>
        <span>error: {error()}</span>
      </Show>
      <HCaptcha
        sitekey="3daae85e-09ab-4ff6-9f24-e8f4f335e433"
        onLoad={(instance) => (hcaptcha = instance)}
        size="invisible"
      />
    </div>
  );
}
