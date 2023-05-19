import { useFloating } from "solid-floating-ui";
import { For, Match, Show, Switch, createSignal, onCleanup } from "solid-js";
import { Portal } from "solid-js/web";

import { autoUpdate, flip, offset, shift } from "@floating-ui/dom";
import { Motion, Presence } from "@motionone/solid";

import { FloatingElement, floatingElements } from "../../directives";

import { TooltipBase } from "./Tooltip";
import { UserCard } from "./UserCard";

/**
 * Render the actual floating elements
 */
export function FloatingManager() {
  return (
    <Portal mount={document.getElementById("floating")!}>
      <For each={floatingElements()}>
        {(element) => (
          <Presence>
            <Show when={element.show()}>
              <Floating {...element} />
            </Show>
          </Presence>
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

  /**
   * Figure out placement of the floating element
   */
  const placement = () => {
    const current = props.show();

    switch (current) {
      case "tooltip":
        return props.config.tooltip!.placement;
      case "userCard":
        return "right-start";
    }
  };

  const position = useFloating(() => props.element, floating, {
    placement: placement(),
    whileElementsMounted: autoUpdate,
    middleware: [offset(5), flip(), shift()],
  });

  /**
   * Handle page clicks outside of floating element
   * @param event Event
   */
  function onClickPage(event: MouseEvent) {
    const parentEl = floating();

    let currentEl = event.target as HTMLElement | null;
    while (currentEl && currentEl !== parentEl) {
      currentEl = currentEl.parentElement;
    }

    if (currentEl === null) {
      props.hide();
    }
  }

  // We know what we're doing here...
  // eslint-disable-next-line solid/reactivity
  if (props.config.userCard) {
    setTimeout(() => document.addEventListener("click", onClickPage));
    onCleanup(() => document.removeEventListener("click", onClickPage));
  }

  return (
    <Motion
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.1, easing: [0.87, 0, 0.13, 1] }}
    >
      <div
        ref={setFloating}
        style={{
          position: position.strategy,
          top: `${position.y ?? 0}px`,
          left: `${position.x ?? 0}px`,
        }}
      >
        <Switch>
          <Match when={props.show() === "tooltip"}>
            <TooltipBase>{props.config.tooltip!.content}</TooltipBase>
          </Match>
          <Match when={props.show() === "userCard"}>
            <UserCard
              user={props.config.userCard!.user}
              member={props.config.userCard!.member}
            />
          </Match>
        </Switch>
      </div>
    </Motion>
  );
}
