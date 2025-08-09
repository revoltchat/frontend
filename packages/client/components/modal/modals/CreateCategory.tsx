import { createFormControl, createFormGroup } from "solid-forms";

import { Trans } from "@lingui-solid/solid/macro";
import { t } from "@lingui/core/macro";
import { ulid } from "ulid";

import { Dialog, DialogProps, Form2 } from "@revolt/ui";

import { useModals } from "..";
import { Modals } from "../types";

/**
 * Create a new bot
 */
export function CreateCategoryModal(
  props: DialogProps & Modals & { type: "create_category" },
) {
  const { showError } = useModals();

  const group = createFormGroup({
    name: createFormControl(""),
  });

  async function onSubmit() {
    try {
      props.server.edit({
        categories: [
          ...(props.server.categories ?? []),
          {
            id: ulid(),
            title: group.controls.name.value,
            channels: [],
          },
        ],
      });

      props.onClose();
    } catch (error) {
      showError(error);
    }
  }

  return (
    <Dialog
      show={props.show}
      onClose={props.onClose}
      title={<Trans>Create a new category</Trans>}
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
      isDisabled={group.isPending}
    >
      <form onSubmit={Form2.submitHandler(group, onSubmit)}>
        <Form2.TextField
          name="name"
          control={group.controls.name}
          label={t`Name`}
        />
      </form>
    </Dialog>
  );
}
