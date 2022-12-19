import { For } from "solid-js";
import { Modals } from "./types";
import { RenderModal } from "./modals";
import { createStore, SetStoreFunction } from "solid-js/store";

export type ActiveModal = {
  /**
   * Unique modal Id
   */
  id: string;

  /**
   * Whether to show the modal
   */
  show: boolean;

  /**
   * Props to pass to modal
   */
  props: Modals;
};

/**
 * Global modal controller for layering and displaying modals to the user
 */
class ModalController {
  modals: ActiveModal[];
  setModals: SetStoreFunction<ActiveModal[]>;

  constructor() {
    const [modals, setModals] = createStore<ActiveModal[]>([]);
    this.modals = modals;
    this.setModals = setModals;

    this.pop = this.pop.bind(this);
  }

  /**
   * Add a modal to the stack
   * @param props Modal parameters
   */
  push(props: Modals) {
    this.setModals([
      ...this.modals,
      {
        // just need something unique
        id: Math.random().toString(),
        show: true,
        props,
      },
    ]);
  }

  /**
   * Remove the top modal
   */
  pop() {
    const modal = this.modals.find(
      (_, index) => index === this.modals.length - 1
    );

    if (modal) {
      this.remove(modal.id);
    }
  }

  /**
   * Close modal by id
   */
  remove(id: string) {
    this.setModals((entry) => entry.id === id, "show", false);

    setTimeout(() => {
      this.setModals(this.modals.filter((entry) => entry.id !== id));
    }, 500); /** FIXME / TODO: set to motion anim time + 100ms */
  }
}

export const modalController = new ModalController();

export function ModalRenderer() {
  return (
    <For each={modalController.modals}>
      {(entry) => <RenderModal {...entry} />}
    </For>
  );
}
