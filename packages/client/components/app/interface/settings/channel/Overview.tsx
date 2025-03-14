import { BiSolidCloud, BiSolidTrash } from "solid-icons/bi";
import { For, Match, Show, Switch, createSignal, onMount } from "solid-js";

import type { ChannelWebhook } from "revolt.js";

import { useClient } from "@revolt/client";
import {
  Avatar,
  Button,
  CategoryButton,
  Column,
  Form2,
  Preloader,
  Text,
  Typography,
} from "@revolt/ui";

import { useSettingsNavigation } from "../Settings";

import { ChannelSettingsProps } from ".";
import { createFormControl, createFormGroup } from "solid-forms";
import { useTranslation } from "@revolt/i18n";

/**
 * Overview
 */
export default function ChannelOverview(props: ChannelSettingsProps) {
  const t = useTranslation();

  const editGroup = createFormGroup({
    name: createFormControl(props.channel.name),
    description: createFormControl(props.channel.description),
  });

  async function onSubmit() {
    // TODO: fix: server shouldn't push events if values don't change!
    // I don't think it makes sense for it to be a client-side fix

    await props.channel.edit({
      name: editGroup.controls.name.value,
      description: editGroup.controls.description.value,
    });
  }

  return (
    <Column gap="xl">
      <form onSubmit={Form2.submitHandler(editGroup, onSubmit)}>
        <Column>
          <Text class="label">Channel Info</Text>
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
          <Form2.Submit group={editGroup}>Save</Form2.Submit>
        </Column>
      </form>
    </Column>
  );
}
