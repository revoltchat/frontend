import { createSignal, onMount } from "solid-js";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { PaymentElement, Elements, useStripe, useElements } from "solid-stripe";
import { Button } from "@revolt/ui";

/**
 * Subscription Page
 */
export default function Subscription() {
  const [stripe, setStripe] = createSignal<Stripe | null>(null);

  onMount(async () => {
    const _stripe = await loadStripe(
      "pk_test_51QeG4NQS9UmC2GH3zIQp8F8hpOtSiq1Cix94Xjf0giCm6MW5qj0Wtdf4RY5HpvtG2Z8CmlR1W5ELLAqjSxgZjTAn00899Z6cfd"
    );

    console.info("loaded stripe", stripe);

    setStripe(_stripe);
  });

  return (
    <Elements
      stripe={stripe()}
      options={{
        // TODO: client secret
        mode: "subscription",
        amount: 500,
        currency: "gbp",
      }}
    >
      <CheckoutForm />
    </Elements>
  );
}

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = createSignal(null);

  return (
    <form>
      <PaymentElement />
      <Button type="submit" isDisabled={!stripe() || !elements()}>
        Pay
      </Button>
      {/* Show error message to your customers */}
      {errorMessage() && <div>{errorMessage()}</div>}
    </form>
  );
};
