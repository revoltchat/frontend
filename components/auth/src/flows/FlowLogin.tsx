import { clientController } from "@revolt/client";
import { Button, Column, FormGroup, Input, Row, Typography } from "@revolt/ui";
import { useNavigate } from "@solidjs/router";
import HCaptcha, { HCaptchaFunctions } from "solid-hcaptcha";
import { createSignal, Show } from "solid-js";
import { styled } from "solid-styled-components";

import wave from "./wave.svg";

const Wave = styled.img`
  height: 1.8em;
`;

export default function FlowLogin() {
  let hcaptcha: HCaptchaFunctions | undefined;

  const navigate = useNavigate();

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

        navigate("/", { replace: true });
      } catch (err) {
        setError("login failed");
      }
    } catch (err) {
      setError("hCaptcha cancelled or failed");
    }
  };

  return (
    <form onsubmit={login}>
      <Column>
        <Row align gap="sm">
          <Wave src={wave} />
          <Typography variant="h1">Welcome back!</Typography>
        </Row>
        <Typography variant="subtitle">Sign into Revolt</Typography>

        <FormGroup>
          <Typography variant="label">Email</Typography>
          <Input
            name="email"
            type="email"
            placeholder="Enter your email."
            onInput={(e) => setEmail(e.currentTarget.value)}
          />
        </FormGroup>

        <FormGroup>
          <Typography variant="label">Password</Typography>
          <Input
            minlength={8}
            name="password"
            type="password"
            placeholder="Enter your password."
            onInput={(e) => setPassword(e.currentTarget.value)}
          />
        </FormGroup>

        <Button type="submit">login</Button>

        <Show when={error()}>
          <span>error: {error()}</span>
        </Show>
      </Column>

      <HCaptcha
        sitekey="3daae85e-09ab-4ff6-9f24-e8f4f335e433"
        onLoad={(instance) => (hcaptcha = instance)}
        size="invisible"
      />
    </form>
  );
}
