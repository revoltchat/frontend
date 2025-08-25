import { JSXElement, createSignal, onMount } from "solid-js";
import { Elements, PaymentElement, useElements, useStripe } from "solid-stripe";

import { loadStripe } from "@stripe/stripe-js/pure";

/**
 * Tier selection and purchase flow
 */
export function EditSubscriptionJoinFlow() {
  const stripe = useStripe();
  const elements = useElements();

  return (
    <form>
      <PaymentElement />
      <button type="submit" disabled={!stripe() || !elements()}>
        Pay
      </button>
      {/* Show error message to your customers */}
      {/* {errorMessage() && <div>{errorMessage()}</div>} */}
    </form>
  );
}

export function TempMountStripe(props: { children: JSXElement }) {
  const [stripe, setStripe] = createSignal(null);

  onMount(async () => {
    const _stripe = await loadStripe(
      "pk_test_51QeG4NQS9UmC2GH3zIQp8F8hpOtSiq1Cix94Xjf0giCm6MW5qj0Wtdf4RY5HpvtG2Z8CmlR1W5ELLAqjSxgZjTAn00899Z6cfd",
    );

    setStripe(_stripe as never);
  });

  const theme = window.getComputedStyle(document.body);

  return (
    <Elements
      stripe={stripe()}
      options={{
        mode: "payment",
        amount: 1099,
        currency: "gbp",

        appearance: {
          variables: {
            colorPrimary: theme.getPropertyValue("--md-sys-color-tertiary"),
            colorText: theme.getPropertyValue("--md-sys-color-on-surface"),
            colorBackground: theme.getPropertyValue("--md-sys-color-surface"),
            colorDanger: theme.getPropertyValue("--md-sys-color-error"),
          },
        },
      }}
    >
      {props.children}
    </Elements>
  );
}
