import { useFloating } from "solid-floating-ui";
import { For, Show, createSignal, onMount } from "solid-js";
import { Portal } from "solid-js/web";

import { autoUpdate, flip, offset, shift } from "@floating-ui/dom";

import { FloatingElement, floatingElements } from "../../directives";

/**
 * Render the actual floating elements
 */
export function FloatingManager() {
  return (
    <Portal mount={document.getElementById("floating")!}>
      <For each={floatingElements()}>
        {(element) => (
          <Show when={element.show()}>
            <Floating {...element} />
          </Show>
        )}
      </For>
    </Portal>
  );
}

/**
 * Render a floating element
 */
function Floating(props: FloatingElement) {
  const [floating, setFloating] = createSignal<HTMLDivElement>();
  const position = useFloating(() => props.element, floating, {
    placement: "right-start",
    whileElementsMounted: autoUpdate,
    middleware: [offset(5), flip(), shift()],
  });

  return (
    <div
      ref={setFloating}
      style={{
        position: position.strategy,
        top: `${position.y ?? 0}px`,
        left: `${position.x ?? 0}px`,
      }}
    >
      hello!
    </div>
  );
}
