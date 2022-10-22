import { FlowTitle } from "./Flow";
import { Button } from "@revolt/ui";
import { Fields, Form } from "./Form";
import { useNavigate } from "@revolt/routing";
import { clientController } from "../../../client";

/**
 * Flow for logging into an account
 */
export default function FlowLogin() {
  const navigate = useNavigate();

  async function login(data: FormData) {
    const email = data.get("email") as string;
    const password = data.get("password") as string;
    const captcha = data.get("captcha") as string;

    try {
      await clientController.login({
        email,
        password,
        captcha,
      });

      navigate("/", { replace: true });
    } catch (err) {
      // setError("login failed");
      console.error("error!");
    }
  }

  return (
    <>
      <FlowTitle subtitle="Sign into Revolt">Welcome back!</FlowTitle>
      <Form onSubmit={login} captcha={"3daae85e-09ab-4ff6-9f24-e8f4f335e433"}>
        <Fields fields={["email", "password"]} />
        <Button type="submit">Login</Button>
      </Form>
    </>
  );
}
