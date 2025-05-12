import { Accessor, createEffect, createSignal } from "solid-js";

import { Trans, useLingui } from "@lingui-solid/solid/macro";
import { ServerMember } from "revolt.js";

import {
  Avatar,
  Column,
  MessageContainer,
  TextField,
  Username,
} from "@revolt/ui";

import { PropGenerator } from "../types";

function Preview(props: { nickname: Accessor<string>; member: ServerMember }) {
  createEffect(() => {
    console.info("n:", props.nickname());
  });

  return (
    <>
      <span>Preview</span>
      <MessageContainer
        avatar={<Avatar size={36} src={props.member.animatedAvatarURL} />}
        timestamp={new Date()}
        username={
          <Username
            username={props.nickname()}
            colour={props.member.roleColour!}
          />
        }
      >
        Hello {props.nickname()}!
      </MessageContainer>
    </>
  );
}

/**
 * Modal to update the user's server identity
 */
const ServerIdentity: PropGenerator<"server_identity"> = (props) => {
  const { t } = useLingui();
  const [nickname, setNickname] = createSignal(props.member.nickname ?? "");

  return {
    title: <Trans>Change identity on {props.member.server!.name}</Trans>,
    children: (
      <Column>
        {/* <span>developer ui</span> */}
        <TextField
          label={t`Nickname`}
          value={nickname()}
          onChange={(e) => setNickname(e.currentTarget.value)}
        />
        {/* <span>{t("app.special.popovers.server_identity.avatar")}</span> */}
        {/* <Avatar size={64} src={props.member.animatedAvatarURL} interactive /> */}
        {/* <Preview nickname={nickname} member={props.member} /> */}
      </Column>
    ),
    actions: [
      {
        children: <Trans>Save</Trans>,
        async onClick() {
          await props.member.edit(
            nickname()
              ? {
                  nickname: nickname(),
                }
              : {
                  remove: ["Nickname"],
                },
          );

          return true;
        },
      },
    ],
  };
};

export default ServerIdentity;
