import { FlowTitle } from "./Flow";
import { Button, Preloader, Typography } from "@revolt/ui";
import { Link, useParams } from "@revolt/routing";
import { useTranslation } from "@revolt/i18n";
import { createSignal, Match, onMount, Switch } from "solid-js";
import { clientController, mapAnyError } from "@revolt/client";

type State = {
  state: 'verifying'
} | {
  state: 'error',
  error: string
} | {
  state: 'success',
  // ticket
}

/**
 * Flow for confirming email
 */
export default function FlowVerify() {
  const t = useTranslation();
  const params = useParams();

  const [state, setState] = createSignal<State>({ state: 'success' });

  onMount(() => {
    /*clientController.getAnonymousClient().api.post(`/auth/account/verify/${params.token}`)
      .then(() => setState({ state: 'success' }))
      .catch(err => setState({ state: 'error', error: mapAnyError(err) }));*/
  });

  return (
    <Switch>
      <Match when={state().state === 'verifying'}>
        <FlowTitle>{t("login.verifying_account")}</FlowTitle>
        <Preloader type="ring" />
      </Match>
      <Match when={state().state === 'error'}>
        <FlowTitle>{t("login.error.verify")}</FlowTitle>
        <Typography variant="subtitle">
          {t(`error.${(state() as State & { state: 'error' }).error}`, undefined, (state() as State & { state: 'error' }).error)}
        </Typography>
        <Typography variant="subtitle">
          <Link href="../..">{t("login.remembered")}</Link>
        </Typography>
      </Match>
      <Match when={state().state === 'success'}>
        <FlowTitle>{t("login.verified_account")}</FlowTitle>
        <Button>
          {t("login.verified_continue")}
        </Button>
        <Typography variant="subtitle">
          <Link href="../..">{t("login.remembered")}</Link>
        </Typography>
      </Match>
    </Switch>
  );
}
