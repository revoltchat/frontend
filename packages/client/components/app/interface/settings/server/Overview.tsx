import { createFormControl, createFormGroup } from "solid-forms";
import { For, Show, createEffect, on } from "solid-js";

import { Trans, useLingui } from "@lingui-solid/solid/macro";
import type { API } from "revolt.js";

import { useClient } from "@revolt/client";
import { CONFIGURATION } from "@revolt/common";
import {
  CircularProgress,
  Column,
  Form2,
  MenuItem,
  Row,
  Text,
} from "@revolt/ui";

import { ServerSettingsProps } from "../ServerSettings";

/**
 * Server overview
 */
export default function ServerOverview(props: ServerSettingsProps) {
  const { t } = useLingui();
  const client = useClient();

  /* eslint-disable solid/reactivity */
  const editGroup = createFormGroup({
    name: createFormControl(props.server.name),
    description: createFormControl(props.server.description || ""),
    icon: createFormControl<string | File[] | null>(
      props.server.animatedIconURL,
    ),
    banner: createFormControl<string | File[] | null>(props.server.bannerURL),
    systemMessageJoin: createFormControl<string>(
      props.server.systemMessages?.user_joined ?? "disabled",
    ),
    systemMessageLeft: createFormControl<string>(
      props.server.systemMessages?.user_left ?? "disabled",
    ),
    systemMessageKicked: createFormControl<string>(
      props.server.systemMessages?.user_kicked ?? "disabled",
    ),
    systemMessageBanned: createFormControl<string>(
      props.server.systemMessages?.user_banned ?? "disabled",
    ),
  });
  /* eslint-enable solid/reactivity */

  // update fields (if they are not dirty) ourselves:
  createEffect(
    on(
      () => props.server.name,
      (name) =>
        !editGroup.controls.name.isDirty &&
        editGroup.controls.name.setValue(name),
      { defer: true },
    ),
  );

  createEffect(
    on(
      () => props.server.description,
      (description) =>
        description &&
        !editGroup.controls.description.isDirty &&
        editGroup.controls.description.setValue(description),
      { defer: true },
    ),
  );

  createEffect(
    on(
      () => props.server.animatedIconURL,
      (icon) =>
        !editGroup.controls.icon.isDirty &&
        editGroup.controls.icon.setValue(icon ?? null),
      { defer: true },
    ),
  );

  createEffect(
    on(
      () => props.server.bannerURL,
      (banner) =>
        !editGroup.controls.banner.isDirty &&
        editGroup.controls.banner.setValue(banner ?? null),
      { defer: true },
    ),
  );

  createEffect(
    on(
      () => props.server.systemMessages,
      (systemMessages) => {
        !editGroup.controls.systemMessageJoin.isDirty &&
          editGroup.controls.systemMessageJoin.setValue(
            systemMessages?.user_joined ?? 'disabled',
          );
        !editGroup.controls.systemMessageLeft.isDirty &&
          editGroup.controls.systemMessageLeft.setValue(
            systemMessages?.user_left ?? 'disabled',
          );
        !editGroup.controls.systemMessageKicked.isDirty &&
          editGroup.controls.systemMessageKicked.setValue(
            systemMessages?.user_kicked ?? 'disabled',
          );
        !editGroup.controls.systemMessageBanned.isDirty &&
          editGroup.controls.systemMessageBanned.setValue(
            systemMessages?.user_banned ?? 'disabled',
          );
      },
      { defer: true },
    ),
  );

  function onReset() {
    editGroup.controls.name.setValue(props.server.name);
    editGroup.controls.description.setValue(props.server.description || "");
    editGroup.controls.icon.setValue(props.server.animatedIconURL ?? null);
    editGroup.controls.banner.setValue(props.server.bannerURL ?? null);
    editGroup.controls.systemMessageJoin.setValue(
      props.server.systemMessages?.user_joined ?? "disabled",
    );
    editGroup.controls.systemMessageLeft.setValue(
      props.server.systemMessages?.user_left ?? "disabled",
    );
    editGroup.controls.systemMessageKicked.setValue(
      props.server.systemMessages?.user_kicked ?? "disabled",
    );
    editGroup.controls.systemMessageBanned.setValue(
      props.server.systemMessages?.user_banned ?? "disabled",
    );
  }

  async function onSubmit() {
    const changes: API.DataEditServer = {
      remove: [],
    };

    if (editGroup.controls.name.isDirty) {
      changes.name = editGroup.controls.name.value.trim();
    }

    if (editGroup.controls.description.isDirty) {
      const description = editGroup.controls.description.value.trim();

      if (description) {
        changes.description = description;
      } else {
        changes.remove!.push("Description");
      }
    }

    if (editGroup.controls.icon.isDirty) {
      if (!editGroup.controls.icon.value) {
        changes.remove!.push("Icon");
      } else if (Array.isArray(editGroup.controls.icon.value)) {
        changes.icon = await client().uploadFile(
          "icons",
          editGroup.controls.icon.value[0],
          CONFIGURATION.DEFAULT_MEDIA_URL,
        );
      }
    }

    if (editGroup.controls.banner.isDirty) {
      if (!editGroup.controls.banner.value) {
        changes.remove!.push("Banner");
      } else if (Array.isArray(editGroup.controls.banner.value)) {
        changes.banner = await client().uploadFile(
          "banners",
          editGroup.controls.banner.value[0],
          CONFIGURATION.DEFAULT_MEDIA_URL,
        );
      }
    }

    if (
      editGroup.controls.systemMessageJoin.isDirty ||
      editGroup.controls.systemMessageLeft.isDirty ||
      editGroup.controls.systemMessageKicked.isDirty ||
      editGroup.controls.systemMessageBanned.isDirty
    ) {
      changes.system_messages = {
        user_joined: editGroup.controls.systemMessageJoin.value,
        user_left: editGroup.controls.systemMessageLeft.value,
        user_kicked: editGroup.controls.systemMessageKicked.value,
        user_banned: editGroup.controls.systemMessageBanned.value,
      };

      // filter out disabled values
      for (const key in changes.system_messages) {
        if (changes.system_messages[key as keyof typeof changes.system_messages] === 'disabled') {
          delete changes.system_messages[key as keyof typeof changes.system_messages];
        }
      }
    }

    // TODO: API currently expects one or more items here
    if (changes.remove!.length === 0) {
      delete changes.remove;
    }

    await props.server.edit(changes);
  }

  return (
    <Column gap="xl">
      <form onSubmit={Form2.submitHandler(editGroup, onSubmit, onReset)}>
        <Column>
          <Form2.FileInput
            control={editGroup.controls.icon}
            accept="image/*"
            label={t`Server Icon`}
            imageJustify={false}
          />
          <Form2.FileInput
            control={editGroup.controls.banner}
            accept="image/*"
            label={t`Server Banner`}
            imageAspect="232/100"
            imageRounded={false}
            imageJustify={false}
          />
          <Form2.TextField
            name="name"
            control={editGroup.controls.name}
            label={t`Server Name`}
          />
          <Form2.TextField
            autosize
            min-rows={2}
            name="description"
            control={editGroup.controls.description}
            label={t`Server Description`}
            placeholder={t`This server is about...`}
          />

          <Text class="label">System Message Channels</Text>
          <Form2.Select
            label={t`User Joined`}
            control={editGroup.controls.systemMessageJoin}
          >
            <MenuItem value="disabled">
              <Trans>Don't send a message anywhere</Trans>
            </MenuItem>
            <For
              each={props.server.orderedChannels.flatMap(
                (category) => category.channels,
              )}
            >
              {(channel) => (
                <MenuItem value={channel.id}>{channel.name}</MenuItem>
              )}
            </For>
          </Form2.Select>
          <Form2.Select
            label={t`User Left`}
            control={editGroup.controls.systemMessageLeft}
          >
            <MenuItem value="disabled">
              <Trans>Don't send a message anywhere</Trans>
            </MenuItem>
            <For
              each={props.server.orderedChannels.flatMap(
                (category) => category.channels,
              )}
            >
              {(channel) => (
                <MenuItem value={channel.id}>{channel.name}</MenuItem>
              )}
            </For>
          </Form2.Select>
          <Form2.Select
            label={t`User Kicked`}
            control={editGroup.controls.systemMessageKicked}
          >
            <MenuItem value="disabled">
              <Trans>Don't send a message anywhere</Trans>
            </MenuItem>
            <For
              each={props.server.orderedChannels.flatMap(
                (category) => category.channels,
              )}
            >
              {(channel) => (
                <MenuItem value={channel.id}>{channel.name}</MenuItem>
              )}
            </For>
          </Form2.Select>
          <Form2.Select
            label={t`User Banned`}
            control={editGroup.controls.systemMessageBanned}
          >
            <MenuItem value="disabled">
              <Trans>Don't send a message anywhere</Trans>
            </MenuItem>
            <For
              each={props.server.orderedChannels.flatMap(
                (category) => category.channels,
              )}
            >
              {(channel) => (
                <MenuItem value={channel.id}>{channel.name}</MenuItem>
              )}
            </For>
          </Form2.Select>

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
    </Column>
  );
}
