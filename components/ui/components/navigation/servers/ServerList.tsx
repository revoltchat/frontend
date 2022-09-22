import { DragEventHandler, useDragDropContext } from "@thisbeyond/solid-dnd";
import {
  DragDropProvider,
  DragDropSensors,
  DragOverlay,
  SortableProvider,
  createSortable,
  closestCenter,
} from "@thisbeyond/solid-dnd";
import { createSignal, For } from "solid-js";
import { styled } from "solid-styled-components";

const ServerListBase = styled.div`
  .sortable {
    width: 56px;
    height: 52px;
    margin: 1em 0;
    display: grid;
    background: gray;
    place-items: center;
  }

  .sortable.active {
    filter: brightness(0.3);
  }

  .sortable.transition {
    transition: 0.25s ease transform;
  }
`;

const Sortable = (props: { item: number }) => {
  const sortable = createSortable(props.item);
  const [state] = useDragDropContext()!;
  return (
    <div
      use:sortable
      class="sortable"
      classList={{
        active: sortable.isActiveDraggable,
        transition: !!state.active.draggable,
      }}
    >
      {!sortable.isActiveDraggable && props.item}
    </div>
  );
};

export const ServerList = () => {
  const [items, setItems] = createSignal([1, 2, 3, 4, 5, 6]);
  const [activeItem, setActiveItem] = createSignal<number | null>(null);
  const ids = () => items();

  const onDragStart: DragEventHandler = ({ draggable }) =>
    setActiveItem(draggable.id as number);

  const onDragEnd: DragEventHandler = ({ draggable, droppable }) => {
    if (draggable && droppable) {
      const currentItems = ids();
      const fromIndex = currentItems.indexOf(draggable.id as number);
      const toIndex = currentItems.indexOf(droppable.id as number);
      if (fromIndex !== toIndex) {
        const updatedItems = currentItems.slice();
        updatedItems.splice(toIndex, 0, ...updatedItems.splice(fromIndex, 1));
        setItems(updatedItems);
      }
    }
  };

  return (
    <ServerListBase>
      <DragDropProvider
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        collisionDetector={closestCenter}
      >
        <DragDropSensors />
        <div class="column self-stretch">
          <SortableProvider ids={ids()}>
            {/* list header goes here */}
            <For each={items()}>{(item) => <Sortable item={item} />}</For>
            {/* list footer goes here */}
          </SortableProvider>
        </div>
        <DragOverlay>
          <div class="sortable">{activeItem()}</div>
        </DragOverlay>
      </DragDropProvider>
    </ServerListBase>
  );
};
