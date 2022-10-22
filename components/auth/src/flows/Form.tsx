import { Column, FormGroup, Input, Typography } from "@revolt/ui";
import HCaptcha, { HCaptchaFunctions } from "solid-hcaptcha";
import { For, JSX, Show } from "solid-js";

/**
 * Available field types
 */
type Field = "email" | "password";

/**
 * Properties to apply to fields
 */
const FieldConfiguration = {
  email: {
    type: "email",
  },
  password: {
    minLength: 8,
    type: "password",
  },
};

interface FieldProps {
  /**
   * Fields to gather
   */
  fields: Field[];
}

/**
 * Render a bunch of fields with preset values
 */
export function Fields(props: FieldProps) {
  return (
    <For each={props.fields}>
      {(field) => (
        <FormGroup>
          <Typography variant="label">{field}</Typography>
          <Input
            required
            name={field}
            {...FieldConfiguration[field]}
            placeholder={`Enter your ${field}.`}
          />
        </FormGroup>
      )}
    </For>
  );
}

interface Props {
  /**
   * Form children
   */
  children: JSX.Element;

  /**
   * Whether to include captcha token
   */
  captcha?: string;

  /**
   * Submission handler
   */
  onSubmit: (data: FormData) => void;
}

/**
 * Small wrapper for HTML form
 */
export function Form(props: Props) {
  let hcaptcha: HCaptchaFunctions | undefined;

  async function onSubmit(e: Event) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);

    if (props.captcha) {
      if (!hcaptcha) return alert("hCaptcha not loaded!");
      const response = await hcaptcha.execute();
      formData.set("captcha", response!.response);
    }

    props.onSubmit(formData);
  }

  return (
    <form onSubmit={onSubmit}>
      <Column>{props.children}</Column>
      <Show when={props.captcha}>
        <HCaptcha
          sitekey={props.captcha!}
          onLoad={(instance) => (hcaptcha = instance)}
          size="invisible"
        />
      </Show>
    </form>
  );
}
