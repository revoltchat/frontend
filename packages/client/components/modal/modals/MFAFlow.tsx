import { BiRegularArchive, BiSolidKey, BiSolidKeyboard } from "solid-icons/bi";
import {
  For,
  Match,
  Switch,
  createEffect,
  createSignal,
  onMount,
} from "solid-js";

import { Trans, useLingui } from "@lingui-solid/solid/macro";
import type { API } from "revolt.js";

import { CategoryButton, Preloader, TextField } from "@revolt/ui";

import { PropGenerator } from "../types";

/**
 * Modal to create an MFA ticket
 */
const MFAFlow: PropGenerator<"mfa_flow"> = (props) => {
  const { t } = useLingui();

  // Keep track of available methods
  const [methods, setMethods] = createSignal<API.MFAMethod[] | undefined>(
    // eslint-disable-next-line solid/reactivity
    props.state === "unknown" ? props.available_methods : undefined,
  );

  // Current state of the modal
  const [selectedMethod, setSelected] = createSignal<API.MFAMethod>();
  const [response, setResponse] = createSignal<API.MFAResponse>();

  // Fetch available methods if they have not been provided.
  onMount(() => {
    if (!methods() && props.state === "known") {
      setMethods(props.mfa.availableMethods);
    }
  });

  // Always select first available method if only one available.
  createEffect(() => {
    const list = methods();
    if (list) {
      setSelected(list.find((entry) => entry !== "Recovery"));
    }
  });

  /**
   * Callback to generate a new ticket or send response back up the chain
   */
  const generateTicket = async () => {
    const mfa_response = response();
    if (!mfa_response) return false;

    if (props.state === "known") {
      const ticket = await props.mfa.createTicket(mfa_response);
      props.callback(ticket);
    } else {
      props.callback(mfa_response);
    }

    return true;
  };

  return {
    title: <Trans>Confirm action</Trans>,
    description: (
      <Switch
        fallback={
          <Trans>Please select a method to authenticate your request.</Trans>
        }
      >
        <Match when={selectedMethod()}>
          <Trans>Please confirm this action using the selected method.</Trans>
        </Match>
      </Switch>
    ),
    actions: () =>
      selectedMethod()
        ? [
            {
              palette: "primary",
              children: <Trans>Confirm</Trans>,
              onClick: generateTicket,
              confirmation: true,
            },
            {
              palette: "plain",
              children: (
                <Switch fallback={<Trans>Back</Trans>}>
                  <Match when={methods()!.length === 1}>
                    <Trans>Cancel</Trans>
                  </Match>
                </Switch>
              ),
              onClick: () => {
                if (methods()!.length === 1) {
                  props.callback();
                  return true;
                }

                setSelected(undefined);
              },
            },
          ]
        : [
            {
              palette: "plain",
              children: <Trans>Cancel</Trans>,
              onClick: () => {
                props.callback();
                return true;
              },
            },
          ],
    // If we are logging in or have selected a method,
    // don't allow the user to dismiss the modal by clicking off.
    // This is to just generally prevent annoying situations
    // where you accidentally close the modal while logging in
    // or when switching to your password manager.
    nonDismissable:
      // eslint-disable-next-line solid/reactivity
      props.state === "unknown" || typeof selectedMethod !== "undefined",
    children: (
      <Switch fallback={<Preloader type="ring" />}>
        <Match when={selectedMethod()}>
          <Switch>
            <Match when={selectedMethod() === "Password"}>
              <TextField
                type="password"
                label={t`Password`}
                value={(response() as { password: string })?.password}
                onChange={(e) =>
                  setResponse({ password: e.currentTarget.value })
                }
              />
            </Match>
            <Match when={selectedMethod() === "Totp"}>
              <TextField
                type="text"
                label={t`Authenticator App`}
                value={(response() as { totp_code: string })?.totp_code}
                onChange={(e) =>
                  setResponse({ totp_code: e.currentTarget.value })
                }
              />
            </Match>
            <Match when={selectedMethod() === "Recovery"}>
              <TextField
                type="text"
                label={t`Recovery Code`}
                value={(response() as { recovery_code: string })?.recovery_code}
                onChange={(e) =>
                  setResponse({ recovery_code: e.currentTarget.value })
                }
              />
            </Match>
          </Switch>
        </Match>
        <Match when={methods()}>
          <For each={methods()}>
            {(method) => (
              <CategoryButton
                action="chevron"
                icon={
                  <Switch>
                    <Match when={method === "Password"}>
                      <BiSolidKeyboard size={24} />
                    </Match>
                    <Match when={method === "Totp"}>
                      <BiSolidKey size={24} />
                    </Match>
                    <Match when={method === "Recovery"}>
                      <BiRegularArchive size={24} />
                    </Match>
                  </Switch>
                }
                onClick={() => {
                  setSelected(method);
                  setResponse(undefined);
                }}
              >
                <Switch>
                  <Match when={method === "Password"}>
                    <Trans>Password</Trans>
                  </Match>
                  <Match when={method === "Totp"}>
                    <Trans>Authenticator App</Trans>
                  </Match>
                  <Match when={method === "Recovery"}>
                    <Trans>Recovery Code</Trans>
                  </Match>
                </Switch>
              </CategoryButton>
            )}
          </For>
        </Match>
      </Switch>
    ),
  };
};

export default MFAFlow;
