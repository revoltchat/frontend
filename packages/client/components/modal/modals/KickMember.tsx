import { Trans } from "@lingui-solid/solid/macro";

import { Avatar, Column } from "@revolt/ui";

import { createFormModal } from "../form";
import { PropGenerator } from "../types";

/**
 * Modal to kick server member
 */
const KickMember: PropGenerator<"kick_member"> = (props) => {
  return createFormModal({
    modalProps: {
      title: <Trans>Kick Member</Trans>,
    },
    schema: {
      member: "custom",
    },
    data: {
      member: {
        element: (
          <Column align>
            <Avatar src={props.member.user?.animatedAvatarURL} size={64} />
            <Trans>
              Are you sure you want to kick {props.member.user?.username}?
            </Trans>
          </Column>
        ),
      },
    },
    callback: () => props.member.kick(),
    submit: {
      variant: "error",
      children: <Trans>Kick</Trans>,
    },
  });
};

export default KickMember;
