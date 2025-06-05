import { createFormControl, createFormGroup } from "solid-forms";
import { Show } from "solid-js";

import { Trans } from "@lingui-solid/solid/macro";
import { t } from "@lingui/core/macro";
import { API, ChannelWebhook } from "revolt.js";

import { useClient } from "@revolt/client";
import { CONFIGURATION } from "@revolt/common";
import {
  CategoryButton,
  CircularProgress,
  Column,
  Form2,
  Row,
} from "@revolt/ui";

import MdContentCopy from "@material-design-icons/svg/outlined/content_copy.svg?component-solid";
import MdDelete from "@material-design-icons/svg/outlined/delete.svg?component-solid";

/**
 * Webhook
 */
export function ViewWebhook(props: { webhook: ChannelWebhook }) {
  const client = useClient();

  const editGroup = createFormGroup({
    name: createFormControl(props.webhook.name),
    avatar: createFormControl<string | File[] | null>(props.webhook.avatarURL),
  });

  async function onSubmit() {
    const changes: API.DataEditWebhook = {
      remove: [],
    };

    if (editGroup.controls.name.isDirty) {
      changes.name = editGroup.controls.name.value.trim();
    }

    if (editGroup.controls.avatar.isDirty) {
      if (!editGroup.controls.avatar.value) {
        changes.remove!.push("Avatar");
      } else if (Array.isArray(editGroup.controls.avatar.value)) {
        const body = new FormData();
        body.append("file", editGroup.controls.avatar.value[0]);

        const [key, value] = client().authenticationHeader;
        const data: { id: string } = await fetch(
          `${CONFIGURATION.DEFAULT_MEDIA_URL}/avatars`,
          {
            method: "POST",
            body,
            headers: {
              [key]: value,
            },
          },
        ).then((res) => res.json());

        changes.avatar = data.id;
      }
    }

    await props.webhook.edit(changes);
  }

  function onReset() {
    editGroup.controls.name.setValue(props.webhook.name);
    editGroup.controls.avatar.setValue(props.webhook.avatarURL ?? null);
  }

  return (
    <Column gap="xl">
      <form onSubmit={Form2.submitHandler(editGroup, onSubmit, onReset)}>
        <Column>
          <Form2.FileInput
            control={editGroup.controls.avatar}
            accept="image/*"
            label={t`Webhook Icon`}
            imageJustify={false}
          />
          <Form2.TextField
            name="name"
            control={editGroup.controls.name}
            label={t`Webhook Name`}
          />
          <Row>
            <Form2.Reset group={editGroup} onReset={onReset} />
            <Form2.Submit group={editGroup}>
              <Trans>Save</Trans>
            </Form2.Submit>
            <Show when={editGroup.isPending}>
              <CircularProgress />
            </Show>
          </Row>
        </Column>
      </form>

      <Column>
        <CategoryButton
          action="chevron"
          icon={<MdContentCopy />}
          onClick={() =>
            navigator.clipboard.writeText(
              `${CONFIGURATION.DEFAULT_API_URL}/webhooks/${props.webhook.id}/${props.webhook.token}`,
            )
          }
        >
          <Trans>Copy webhook URL</Trans>
        </CategoryButton>
        <CategoryButton
          action="chevron"
          icon={<MdDelete />}
          onClick={() => props.webhook.delete()}
        >
          Delete webhook
        </CategoryButton>
      </Column>
    </Column>
  );
}
