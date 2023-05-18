import { useFloating } from "solid-floating-ui";
import { Accessor, JSX, createSignal, onCleanup } from "solid-js";
import { Portal } from "solid-js/web";

import { autoUpdate, flip, offset, shift } from "@floating-ui/dom";

type Props = JSX.Directives["floating"] & object;

export type FloatingElement = {
  config: Props;
  element: HTMLElement;
  show: Accessor<keyof Props | undefined>;
};

const [floatingElements, setFloatingElements] = createSignal<FloatingElement[]>(
  []
);

export { floatingElements };

/**
 * Add floating elements
 * @param element Element
 * @param accessor Parameters
 */
export function floating(element: HTMLElement, accessor: Accessor<Props>) {
  const config = accessor();
  const [show, setShow] = createSignal<keyof Props | undefined>();

  setFloatingElements((elements) => [
    ...elements,
    {
      config,
      element,
      show,
    },
  ]);

  function onMouseEnter() {
    setShow("tooltip");
  }

  function onMouseLeave() {
    setShow(undefined);
  }

  if (config.tooltip) {
    element.addEventListener("mouseenter", onMouseEnter);
    element.addEventListener("mouseleave", onMouseLeave);
  }

  onCleanup(() => {
    setFloatingElements((elements) =>
      elements.filter((entry) => entry.element !== element)
    );

    if (config.tooltip) {
      element.removeEventListener("mouseenter", onMouseEnter);
      element.removeEventListener("mouseleave", onMouseLeave);
    }
  });
}
