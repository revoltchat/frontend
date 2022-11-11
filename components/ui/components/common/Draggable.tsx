import { createEffect, createSignal, For, JSX } from "solid-js";
import { dndzone } from "solid-dnd-directive";

interface Props<T> {
  items: Item<T>[];
  children: (item: T) => JSX.Element;
  onChange: (ids: string[]) => void;
}

type Item<T> = ({ _id: string } & T);

/**
 * The dndzone library requires you to have an id key.
 */
interface ContainerItem<T> {
  id: string;
  item: T;
}

interface DragHandleEvent<T> {
  detail: {
    items: ContainerItem<T>[]
  };
  type: "consider" | "finalize";
}

/**
 * Typescript removes dndzone because it thinks that it is not being used.
 * This trick prevents that from happening.
 * https://github.com/solidjs/solid/issues/1005#issuecomment-1134778606
 */
0 && dndzone;

export function Draggable<T>({ items, children, onChange }: Props<T>) {
  const [containerItems, setContainerItems] = createSignal<ContainerItem<T>[]>([]);

  createEffect(() => {
    const newContainerItems = items.map(item => ({ id: item._id, item }));
    setContainerItems(newContainerItems);
  })

  function handleDndEvent(e: DragHandleEvent<T>) {
    const { items: newContainerItems } = e.detail;
    setContainerItems(newContainerItems);
    if (e.type === 'finalize') onChange(newContainerItems.map(containerItems => containerItems.id));
  }

  /**
    * Directives don't work with solid-styled-components.
    * https://github.com/solidjs/solid-styled-components/issues/4
   */
  return (
    <div use:dndzone={{ items: containerItems }} on:consider={handleDndEvent} on:finalize={handleDndEvent}>
      <For each={containerItems()}>
        {containerItem => children(containerItem.item)}
      </For>
    </div>
  )
};