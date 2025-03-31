import { Trans } from "@lingui-solid/solid/macro";

import { Avatar, Column } from "@revolt/ui";

import { createFormModal } from "../form";
import { PropGenerator } from "../types";

/**
 * Modal to ban server member
 */
const BanMember: PropGenerator<"ban_member"> = (props) => {
  return createFormModal({
    modalProps: {
      title: <Trans>Ban Member</Trans>,
    },
    schema: {
      member: "custom",
      reason: "text",
    },
    data: {
      member: {
        element: (
          <Column align>
            <Avatar src={props.member.user?.animatedAvatarURL} size={64} />
            <Trans>You are about to ban {props.member.user?.username}</Trans>
          </Column>
        ),
      },
      reason: {
        field: <Trans>Ban Reason</Trans>,
      },
    },
    callback: async ({ reason }) =>
      void (await props.member.server!.banUser(props.member.id.user, {
        reason,
      })),
    submit: {
      variant: "error",
      children: <Trans>Ban</Trans>,
    },
  });
};

export default BanMember;
