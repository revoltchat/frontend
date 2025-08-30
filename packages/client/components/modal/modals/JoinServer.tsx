import { createSignal, onCleanup } from "solid-js";
import { createFormControl, createFormGroup } from "solid-forms";

import { Trans } from "@lingui-solid/solid/macro";
import { t } from "@lingui/core/macro";

import { useNavigate } from "@revolt/routing";
import { Column, Dialog, DialogProps, Form2, Text, Avatar } from "@revolt/ui";

import { useModals } from "..";
import { Modals } from "../types";

const RE_INVITE_URL = /(?:invite|rvlt.gg)\/([a-z0-9]+)/i;

/**
 * Modal to join a server
 */
export function JoinServerModal(
  props: DialogProps & Modals & { type: "join_server" },
) {
  const navigate = useNavigate();
  const { showError } = useModals();

  // form group for the input
  const group = createFormGroup({ link: createFormControl("") });

  // signals for invite preview, confirmation state, and invalid input
  const [invitePreview, setInvitePreview] = createSignal<any | null>(null);
  const [awaitingConfirm, setAwaitingConfirm] = createSignal(false);
  const [invalid, setInvalid] = createSignal(false);
  let fetchTimeout: NodeJS.Timeout;

  // handle input changes with debounce
  const onInputChange = () => {
    clearTimeout(fetchTimeout);
    fetchTimeout = setTimeout(async () => {
      try {
        let code = group.controls.link.value.match(RE_INVITE_URL)?.[1] ?? group.controls.link.value;

        if (!code) {
          setInvitePreview(null);
          setAwaitingConfirm(false);
          setInvalid(false);
          return;
        }

        // preview 
        const invite = await props.client.api.get(`/invites/${code}`);
        setInvitePreview(invite);
        setAwaitingConfirm(true);
        setInvalid(false);
      } catch {
        setInvitePreview(null);
        setAwaitingConfirm(false);
        setInvalid(true); // mark as invalid if fetch fails
      }
    }, 300);
  };

  onCleanup(() => clearTimeout(fetchTimeout));

  /**
   * Attempt to join the server using the invite
   */
  const onSubmit = async () => {
    if (!invitePreview()) return;
    const code = group.controls.link.value.match(RE_INVITE_URL)?.[1] ?? group.controls.link.value;

    try {
      // attempt join
      await props.client.api.post(`/invites/${code}`);
    } catch (err: any) {
      if (!(err?.message || "").includes("Conflict")) return showError?.(err.message || err);
    }

    // navigate to invite channel
    navigate(`/channel/${invitePreview().channel_id}`);

    // close modal if defined
    props.onClose?.();
  };

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
          <Text><Trans>Use a code or invite link</Trans></Text>

          {/* input field */}
          <Form2.TextField
            name="link"
            control={group.controls.link}
            label={t`Code`}
            placeholder="rvlt.gg/wVEJDGVs"
          />

          {/* show invalid message if invite fetch failed */}
          {invalid() && (
            <Text size="small" style={{ color: "var(--danger-color)", marginTop: "0.25rem" }}>
              😢 <Trans>Invalid invite code</Trans>
            </Text>
          )}

          {/* show preview if invite is valid */}
          {awaitingConfirm() && invitePreview() && (
            <Column style={{
              padding: "0.5rem",
              border: "1px solid var(--border-color)",
              borderRadius: "6px",
              marginTop: "0.5rem",
              gap: "0.5rem",
              flexDirection: "row",
              alignItems: "center",
            }}>
              <Avatar
                src={invitePreview().server_icon
                  ? `https://cdn.revoltusercontent.com/icons/${invitePreview().server_icon._id}?max_side=256`
                  : invitePreview().user_avatar
                    ? `https://cdn.revoltusercontent.com/avatars/${invitePreview().user_avatar._id}?max_side=256`
                    : undefined
                }
                size={32}
              />
              <Column style={{ flex: 1, gap: "0.25rem" }}>
                <Text weight="bold">{invitePreview().server_name || invitePreview().channel_name}</Text>
              </Column>
              {invitePreview().member_count && (
                <Text size="small" style={{ marginLeft: "auto" }}>
                  {invitePreview().member_count} members
                </Text>
              )}
            </Column>
          )}
        </Column>
      </form>
    </Dialog>
  );
}
