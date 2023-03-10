import { Match, Switch, createSignal, onMount } from "solid-js";

import { IS_REVOLT, mapAnyError } from "@revolt/client";
import { useTranslation } from "@revolt/i18n";
import { Column, styled } from "@revolt/ui";

import { modalController } from "..";
import { createFormModal } from "../form";
import { PropGenerator } from "../types";

/**
 * Code block which displays invite
 */
const Invite = styled(Column)`
  code {
    padding: 1em;
    user-select: all;
    font-size: 1.4em;
    text-align: center;
    font-family: var(--monospace-font);
  }
`;

/**
 * Modal to create a new invite
 */
const CreateInvite: PropGenerator<"create_invite"> = (props) => {
  const t = useTranslation();

  const [processing, setProcessing] = createSignal(false);
  const [code, setCode] = createSignal("...");

  // Generate an invite code
  onMount(() => {
    setProcessing(true);

    props.channel
      .createInvite()
      .then(({ _id }) => setCode(_id))
      .catch((err) =>
        modalController.push({ type: "error", error: mapAnyError(err) })
      )
      .finally(() => setProcessing(false));
  });

  return createFormModal({
    modalProps: {
      title: t("app.context_menu.create_invite"),
    },
    schema: {
      invite: "custom",
    },
    data: {
      invite: {
        element: (
          <Switch
            fallback={t("app.special.modals.prompt.create_invite_generate")}
          >
            <Match when={!processing()}>
              <Invite>
                {t("app.special.modals.prompt.create_invite_created")}
                <code>{code}</code>
              </Invite>
            </Match>
          </Switch>
        ),
      },
    },
    callback: async () => void 0,
    submit: {
      children: t("app.special.modals.actions.ok"),
    },
    actions: [
      {
        children: t("app.context_menu.copy_link"),
        onClick: () =>
          modalController.writeText(
            IS_REVOLT
              ? `https://rvlt.gg/${code}`
              : `${window.location.host}/invite/${code}`
          ),
      },
    ],
  });
};

export default CreateInvite;
