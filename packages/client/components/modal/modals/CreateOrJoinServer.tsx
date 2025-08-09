import { Trans } from "@lingui-solid/solid/macro";
import { styled } from "styled-system/jsx";

import { Dialog, DialogProps, iconSize } from "@revolt/ui";

import MdAdd from "@material-design-icons/svg/outlined/add.svg?component-solid";
import MdLink from "@material-design-icons/svg/outlined/link.svg?component-solid";

import { useModals } from "..";
import { Modals } from "../types";

/**
 * Modal to create or join a server
 */
export function CreateOrJoinServerModal(
  props: DialogProps & Modals & { type: "create_or_join_server" },
) {
  const { openModal } = useModals();

  return (
    <Dialog
      show={props.show}
      onClose={props.onClose}
      title="Create or join a server"
      actions={[
        {
          text: "Create",
          onClick: () => {
            openModal({
              type: "create_server",
              client: props.client,
            });
          },
        },
        {
          text: "Join",
          onClick: () => {
            openModal({ type: "join_server", client: props.client });
          },
        },
      ]}
    >
      <Trans>
        Would you like to create a new server or join an existing one?
      </Trans>
    </Dialog>
  );
}
