import { VirtualContainer } from "@minht11/solid-virtual-container";

import { compositionContent } from "./CompositionMediaPicker";

export function EmojiPicker() {
  const items = new Array(1000).fill(0).map((x, i) => i);
  let scrollTargetElement!: HTMLDivElement;

  return (
    <div
      class={compositionContent()}
      style={{ overflow: "auto" }}
      ref={scrollTargetElement}
    >
      <VirtualContainer
        items={items}
        scrollTarget={scrollTargetElement}
        itemSize={{ height: 50, width: 50 }}
        // Calculate how many columns to show.
        crossAxisCount={(measurements) =>
          Math.floor(measurements.container.cross / measurements.itemSize.cross)
        }
      >
        {ListItem}
      </VirtualContainer>
    </div>
  );
}

const ListItem = (props: {
  style: unknown;
  tabIndex: number;
  item: number;
}) => (
  <div
    style={props.style as never}
    tabIndex={props.tabIndex}
    class="width-full"
    role="listitem"
  >
    <div>{props.item}</div>
  </div>
);
