import { createFormControl, createFormGroup } from "solid-forms";

import { Trans } from "@lingui-solid/solid/macro";
import { t } from "@lingui/core/macro";
import { useMutation } from "@tanstack/solid-query";

import { Form2, Modal2, Modal2Props } from "@revolt/ui";

import { useModals } from "..";
import { Modals } from "../types";

/**
 * Add a new friend by username
 */
export function AddFriend(
  props: Modal2Props & Modals & { type: "add_friend" },
) {
  const { openModal } = useModals();

  const group = createFormGroup({
    username: createFormControl(""),
  });

  const change = useMutation(() => ({
    mutationFn: (username: string) =>
      props.client.api.post(`/users/friend`, { username }),
    onError: (error) => openModal({ type: "error2", error }),
  }));

  async function onSubmit() {
    await change.mutateAsync(group.controls.username.value);
    props.onClose();
  }

  return (
    <Modal2
      show={props.show}
      onClose={props.onClose}
      title={<Trans>Add a new friend</Trans>}
      actions={[
        { text: <Trans>Close</Trans> },
        {
          text: <Trans>Send Request</Trans>,
          onClick: () => {
            onSubmit();
            return false;
          },
        },
      ]}
      isDisabled={change.isPending}
    >
      <form onSubmit={Form2.submitHandler(group, onSubmit)}>
        <Form2.TextField
          name="username"
          control={group.controls.username}
          label={t`Username`}
          placeholder={t`username#1234`}
        />
      </form>
    </Modal2>
  );
}
