import { createSignal, onCleanup } from "solid-js";
import { createFormControl, createFormGroup } from "solid-forms";

import { Trans } from "@lingui-solid/solid/macro";
import { t } from "@lingui/core/macro";

import { useNavigate } from "@revolt/routing";
import { Column, Dialog, DialogProps, Form2, Text, Avatar } from "@revolt/ui";

import { useModals } from "..";
import { Modals } from "../types";

const RE_INVITE_URL = /(?:invite|rvlt.gg)\/([a-z0-9]+)/gi;

/**
 * Modal to join a server
 */
export function JoinServerModal(
  props: DialogProps & Modals & { type: "join_server" },
) {
  const navigate = useNavigate();
  const modals = useModals();
  const showError = modals?.showError;

  const group = createFormGroup({
    link: createFormControl(""),
  });

  const [invitePreview, setInvitePreview] = createSignal<any | null>(null);
  const [awaitingConfirm, setAwaitingConfirm] = createSignal(false);
  let fetchTimeout: NodeJS.Timeout;

  const onInputChange = () => {
    clearTimeout(fetchTimeout);
    fetchTimeout = setTimeout(async () => {
      try {
        let code = group.controls.link.value;
        const match = RE_INVITE_URL.exec(code);
        if (match) code = match[1];
        if (!code) {
          setInvitePreview(null);
          setAwaitingConfirm(false);
          return;
        }

        const invite = await props.client.api.get(`/invites/${code}`);
        setInvitePreview(invite);
        setAwaitingConfirm(true);
      } catch {
        setInvitePreview(null);
        setAwaitingConfirm(false);
      }
    }, 300);
  };

  onCleanup(() => clearTimeout(fetchTimeout));

  async function onSubmit() {
    try {
      if (!invitePreview()) return;
      const code = group.controls.link.value.match(RE_INVITE_URL)?.[1] ?? group.controls.link.value;

      // attempt to join, ignore "already joined"
      try {
        await props.client.api.post(`/invites/${code}`);
      } catch (joinError: any) {
        const message = joinError?.message || joinError?.toString() || "";
        if (!message.includes("Conflict")) throw joinError;
      }

      // navigate to the invite's channel
      navigate(`/channel/${invitePreview().channel_id}`);

      // close modal if defined
      props.onClose?.();
    } catch (error: any) {
      if (typeof showError === "function") {
        showError(error.message || error);
      } else {
        console.error(error);
      }
    }
  }

  return (
    <Dialog
      show={props.show}
      onClose={props.onClose}
      title={<Trans>Join a server</Trans>}
      actions={[
        { text: <Trans>Close</Trans> },
        awaitingConfirm() && invitePreview() ? { text: <Trans>Join</Trans>, onClick: onSubmit } : null,
      ].filter(Boolean)}
      isDisabled={group.isPending}
    >
      <form onInput={onInputChange} onSubmit={Form2.submitHandler(group, () => {})}>
        <Column>
          <Text>
            <Trans>Use a code or invite link</Trans>
          </Text>

          <Form2.TextField
            name="link"
            control={group.controls.link}
            label={t`Code`}
            placeholder="rvlt.gg/wVEJDGVs"
          />

          {awaitingConfirm() && invitePreview() && (
            <Column
              style={{
                padding: "0.5rem",
                border: "1px solid var(--border-color)",
                borderRadius: "6px",
                marginTop: "0.5rem",
                gap: "0.5rem",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Avatar
                src={
                  invitePreview().server_icon
                    ? `https://cdn.revoltusercontent.com/icons/${invitePreview().server_icon._id}?max_side=256`
                    : invitePreview().user_avatar
                    ? `https://cdn.revoltusercontent.com/avatars/${invitePreview().user_avatar._id}?max_side=256`
                    : undefined
                }
                size={32}
              />
              <Column>
                <Text weight="bold">
                  {invitePreview().server_name || invitePreview().channel_name}
                </Text>
                {invitePreview().member_count && (
                  <Text size="small">{invitePreview().member_count} members</Text>
                )}
              </Column>
            </Column>
          )}
        </Column>
      </form>
    </Dialog>
  );
}
