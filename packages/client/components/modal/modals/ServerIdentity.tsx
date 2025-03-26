import { Accessor, createEffect, createSignal } from "solid-js";

import { ServerMember } from "revolt.js";

import { Avatar, Column, Input, MessageContainer, Username } from "@revolt/ui";

import { PropGenerator } from "../types";
import { Trans } from "@lingui-solid/solid/macro";

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
  const [nickname, setNickname] = createSignal(props.member.nickname ?? "");

  return {
    title: <Trans>Change identity on {props.member.server!.name}</Trans>,
    children: (
      <Column>
        {/* <span>developer ui</span> */}
        <span>
          <Trans>Nickname</Trans>
        </span>
        <Input
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
                }
          );

          return true;
        },
      },
    ],
  };
};

export default ServerIdentity;
