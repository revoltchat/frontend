import { Trans } from "@lingui-solid/solid/macro";

import { Avatar, Modal2, Modal2Props } from "@revolt/ui";

import { Modals } from "../types";

export function EmojiPreviewModal(
  props: Modal2Props & Modals & { type: "emoji_preview" },
) {
  return (
    <Modal2
      show={props.show}
      onClose={props.onClose}
      title={`:${props.emoji.name}:`}
      actions={[
        {
          text: <Trans>Delete</Trans>,
          async onClick() {
            await props.emoji.delete();
          },
        },
        { text: <Trans>Close</Trans> },
      ]}
    >
      <Avatar src={props.emoji.url} shape="rounded-square" />
    </Modal2>
  );
}
