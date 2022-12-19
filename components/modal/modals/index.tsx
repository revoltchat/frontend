import { Modal } from "@revolt/ui";
import { ActiveModal, modalController } from "..";
import type { Modals as AllModals, PropGenerator } from "../types";

import clipboard from "./Clipboard";

const Modals: Record<AllModals["type"], PropGenerator<any>> = {
  clipboard,
  ...({} as any),
};

export function RenderModal(props: ActiveModal) {
  const modalProps = Modals[props.props.type](props.props);
  return (
    <Modal
      show={props.show}
      onClose={() => modalController.remove(props.id)}
      {...modalProps}
    />
  );
}
