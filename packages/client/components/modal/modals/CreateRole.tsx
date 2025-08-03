import { createFormControl, createFormGroup } from "solid-forms";

import { Trans } from "@lingui-solid/solid/macro";
import { t } from "@lingui/core/macro";
import { useMutation } from "@tanstack/solid-query";

import { Form2, Modal2, Modal2Props } from "@revolt/ui";

import { useModals } from "..";
import { Modals } from "../types";

/**
 * Create a new server role
 */
export function CreateRoleModal(
  props: Modal2Props & Modals & { type: "create_role" },
) {
  const { openModal } = useModals();

  const role = createFormGroup({
    name: createFormControl(""),
  });

  const change = useMutation(() => ({
    mutationFn: (name: string) => props.server.createRole(name),
    onSuccess: (role) => props.callback(role.id),
    onError: (error) => openModal({ type: "error2", error }),
  }));

  async function onSubmit() {
    await change.mutateAsync(role.controls.name.value);

    props.onClose();
  }

  return (
    <Modal2
      minWidth={420}
      show={props.show}
      onClose={props.onClose}
      title={<Trans>Create a Role</Trans>}
      actions={[
        { text: <Trans>Close</Trans> },
        {
          text: <Trans>Create</Trans>,
          onClick: () => {
            onSubmit();
            return false;
          },
        },
      ]}
      isDisabled={change.isPending}
    >
      <form onSubmit={Form2.submitHandler(role, onSubmit)}>
        <Form2.TextField
          name="name"
          control={role.controls.name}
          label={t`Role Name`}
        />
      </form>
    </Modal2>
  );
}
