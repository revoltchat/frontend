import { Trans } from "@lingui-solid/solid/macro";

import { Checkbox2, Column, Form2, Text } from "@revolt/ui";

import { ChannelSettingsProps } from "../ChannelSettings";

/**
 * Group channel permissions
 */
export default function GroupPermissions(props: ChannelSettingsProps) {
  return (
    <Column>
      <Text class="label">
        <Trans>Basic Permissions</Trans>
      </Text>
      <Checkbox2 name="ManageChannel">
        <Trans>Allow others to change the group's name and description.</Trans>
      </Checkbox2>
      <Checkbox2 name="InviteOthers">
        <Trans>Allow anyone to add new members to this group chat.</Trans>
      </Checkbox2>
      <Text class="label">
        <Trans>Advanced Options</Trans>
      </Text>
      <Checkbox2 name="SendMessages">
        <Trans>Let members send messages in this group.</Trans>
      </Checkbox2>
      <Checkbox2 name="SendEmbeds">
        <Trans>
          Let members send embedded content, whether from links or custom text
          embeds.
        </Trans>
      </Checkbox2>
      <Checkbox2 name="UploadFiles">
        <Trans>Let members upload files to the group.</Trans>
      </Checkbox2>
      <Checkbox2 name="Masquerade">
        <Trans>Let members change their name and avatar per-message.</Trans>
      </Checkbox2>
      <Checkbox2 name="UseReactions">
        <Trans>Let members react to others' messages.</Trans>
      </Checkbox2>
      <div>
        <Form2.Submit group={{} as never}>
          <Trans>Save</Trans>
        </Form2.Submit>
      </div>
    </Column>
  );
}
