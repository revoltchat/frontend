import { BiSolidCloud, BiSolidTrash } from "solid-icons/bi";
import { For, Match, Show, Switch, createSignal, onMount } from "solid-js";

import type { API, ChannelWebhook } from "revolt.js";

import { useClient } from "@revolt/client";
import {
  Avatar,
  Button,
  CategoryButton,
  CircularProgress,
  Column,
  FileInput,
  Form2,
  Preloader,
  Row,
  Text,
  Typography,
} from "@revolt/ui";

import { useSettingsNavigation } from "../Settings";

import { ChannelSettingsProps } from ".";
import { createFormControl, createFormGroup } from "solid-forms";
import { useTranslation } from "@revolt/i18n";
import { CONFIGURATION } from "@revolt/common";

/**
 * Overview
 */
export default function ChannelOverview(props: ChannelSettingsProps) {
  const t = useTranslation();
  const client = useClient();

  const editGroup = createFormGroup({
    name: createFormControl(props.channel.name),
    description: createFormControl(props.channel.description || ""),
    icon: createFormControl<string | File[] | null>(
      props.channel.animatedIconURL
    ),
  });

  function onReset() {
    editGroup.controls.name.setValue(props.channel.name);
    editGroup.controls.description.setValue(props.channel.description || "");
    editGroup.controls.icon.setValue(props.channel.animatedIconURL ?? null);
  }

  async function onSubmit() {
    const changes: API.DataEditChannel = {
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

    await props.channel.edit(changes);
  }

  return (
    <Column gap="xl">
      <form onSubmit={Form2.submitHandler(editGroup, onSubmit, onReset)}>
        <Column>
          <Text class="label">Channel Info</Text>
          <Form2.FileInput control={editGroup.controls.icon} accept="image/*" />
          <Form2.TextField
            name="name"
            control={editGroup.controls.name}
            label={t("app.settings.channel_pages.overview.name")}
          />
          <Form2.TextField
            autosize
            min-rows={2}
            name="description"
            control={editGroup.controls.description}
            label={t("app.settings.channel_pages.overview.description")}
            placeholder="This channel is about..."
          />
          <Row>
            <Form2.Reset group={editGroup} onReset={onReset} />
            <Form2.Submit group={editGroup}>Save</Form2.Submit>
            <Show when={editGroup.isPending}>
              <CircularProgress />
            </Show>
          </Row>
        </Column>
      </form>
    </Column>
  );
}
