import { createFormControl, createFormGroup } from "solid-forms";

import { Trans } from "@lingui-solid/solid/macro";
import { t } from "@lingui/core/macro";

import { Column, Dialog, DialogProps, Form2 } from "@revolt/ui";

import { useModals } from "..";
import { Modals } from "../types";

/**
 * Modal to update the user's server identity
 */
export function ServerIdentityModal(
  props: DialogProps & Modals & { type: "server_identity" },
) {
  const { showError } = useModals();

  const group = createFormGroup({
    nickname: createFormControl(props.member.nickname ?? ""),
  });

  async function onSubmit() {
    try {
      const nickname = group.controls.nickname.value;
      await props.member.edit(
        nickname
          ? {
              nickname,
            }
          : {
              remove: ["Nickname"],
            },
      );
      props.onClose();
    } catch (error) {
      showError(error);
    }
  }

  return (
    <Dialog
      show={props.show}
      onClose={props.onClose}
      title={<Trans>Change identity on {props.member.server!.name}</Trans>}
      actions={[
        { text: <Trans>Cancel</Trans> },
        {
          text: <Trans>Save</Trans>,
          onClick: () => {
            onSubmit();
            return false;
          },
        },
      ]}
      isDisabled={group.isPending}
    >
      <form onSubmit={Form2.submitHandler(group, onSubmit)}>
        <Column>
          <Form2.TextField
            name="nickname"
            control={group.controls.nickname}
            label={t`Nickname`}
          />
          {/* TODO: Add preview back */}
          {/* <MessageContainer
            avatar={<Avatar size={36} src={props.member.animatedAvatarURL} />}
            timestamp={new Date()}
            username={
              <Username
                username={group.controls.nickname.value || props.member.user!.displayName}
                colour={props.member.roleColour!}
              />
            }
          >
            Hello {group.controls.nickname.value || props.member.user!.displayName}!
          </MessageContainer> */}
        </Column>
      </form>
    </Dialog>
  );
}
