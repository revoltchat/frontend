import { Show } from "solid-js";

import type { API } from "revolt.js";

import { useClient } from "@revolt/client";
import { CircularProgress, Column, Form2, Row, Text } from "@revolt/ui";

import { ServerSettingsProps } from ".";
import { createFormControl, createFormGroup } from "solid-forms";
import { useTranslation } from "@revolt/i18n";
import { CONFIGURATION } from "@revolt/common";

/**
 * Server overview
 */
export default function ServerOverview(props: ServerSettingsProps) {
  const t = useTranslation();
  const client = useClient();

  const editGroup = createFormGroup({
    name: createFormControl(props.server.name),
    description: createFormControl(props.server.description || ""),
    icon: createFormControl<string | File[] | null>(
      props.server.animatedIconURL
    ),
    banner: createFormControl<string | File[] | null>(props.server.bannerURL),
  });

  function onReset() {
    editGroup.controls.name.setValue(props.server.name);
    editGroup.controls.description.setValue(props.server.description || "");
    editGroup.controls.icon.setValue(props.server.animatedIconURL ?? null);
    editGroup.controls.banner.setValue(props.server.bannerURL ?? null);
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
        const body = new FormData();
        body.append("file", editGroup.controls.icon.value[0]);

        const [key, value] = client().authenticationHeader;
        const data: { id: string } = await fetch(
          `${CONFIGURATION.DEFAULT_MEDIA_URL}/icons`,
          {
            method: "POST",
            body,
            headers: {
              [key]: value,
            },
          }
        ).then((res) => res.json());

        changes.icon = data.id;
      }
    }

    if (editGroup.controls.banner.isDirty) {
      if (!editGroup.controls.banner.value) {
        changes.remove!.push("Banner");
      } else if (Array.isArray(editGroup.controls.banner.value)) {
        const body = new FormData();
        body.append("file", editGroup.controls.banner.value[0]);

        const [key, value] = client().authenticationHeader;
        const data: { id: string } = await fetch(
          `${CONFIGURATION.DEFAULT_MEDIA_URL}/banners`,
          {
            method: "POST",
            body,
            headers: {
              [key]: value,
            },
          }
        ).then((res) => res.json());

        changes.banner = data.id;
      }
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
            label="Server Icon"
            imageJustify={false}
          />
          <Form2.FileInput
            control={editGroup.controls.banner}
            accept="image/*"
            label="Server Banner"
            imageAspect="232/100"
            imageRounded={false}
            imageJustify={false}
          />
          <Form2.TextField
            name="name"
            control={editGroup.controls.name}
            label={t("app.settings.server_pages.overview.name")}
          />
          <Form2.TextField
            autosize
            min-rows={2}
            name="description"
            control={editGroup.controls.description}
            label={t("app.settings.server_pages.overview.description")}
            placeholder="This channel is about..."
          />
          <Row>
            <Form2.Reset group={editGroup} onReset={onReset} />
            <Form2.Submit group={editGroup}>
              {t("app.special.modals.actions.save")}
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
