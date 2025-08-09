import { createFormControl, createFormGroup } from "solid-forms";

import { Trans } from "@lingui-solid/solid/macro";
import { t } from "@lingui/core/macro";

import { Column, Dialog, DialogProps, Form2 } from "@revolt/ui";

import { useModals } from "..";
import { Modals } from "../types";

/**
 * Modal for renaming session
 */
export function RenameSessionModal(
  props: DialogProps & Modals & { type: "rename_session" },
) {
  const { showError } = useModals();

  const group = createFormGroup({
    name: createFormControl(props.session.name),
  });

  async function onSubmit() {
    try {
      await props.session.rename(group.controls.name.value);
      props.onClose();
    } catch (error) {
      showError(error);
    }
  }

  return (
    <Dialog
      show={props.show}
      onClose={props.onClose}
      title={<Trans>Rename Session</Trans>}
      actions={[
        { text: <Trans>Cancel</Trans> },
        {
          text: <Trans>Rename</Trans>,
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
            name="name"
            control={group.controls.name}
            label={t`Name`}
            placeholder={t`Enter a new name for this session`}
          />
        </Column>
      </form>
    </Dialog>
  );
}
