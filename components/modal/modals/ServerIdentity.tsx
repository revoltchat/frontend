import { createSignal } from "solid-js";

import { useTranslation } from "@revolt/i18n";
import { Column, Input } from "@revolt/ui";

import { PropGenerator } from "../types";

/**
 * Modal to update the user's server identity
 */
const ServerIdentity: PropGenerator<"server_identity"> = (props) => {
  const t = useTranslation();
  const [nickname, setNickname] = createSignal(props.member.nickname ?? "");

  return {
    title: t("app.special.popovers.server_identity.title", {
      server: props.member.server!.name,
    }),
    children: (
      <Column>
        <span>developer ui</span>
        <span>{t("app.special.popovers.server_identity.nickname")}</span>
        <Input
          value={nickname()}
          onChange={(e) => setNickname(e.currentTarget.value)}
        />
        <span>{t("app.special.popovers.server_identity.avatar")}</span>
      </Column>
    ),
    actions: [
      {
        children: t("app.special.modals.actions.save"),
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
