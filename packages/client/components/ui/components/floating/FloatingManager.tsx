import { useFloating } from "solid-floating-ui";
import {
  For,
  Match,
  Show,
  Switch,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import { Portal } from "solid-js/web";
import { Motion, Presence } from "solid-motionone";

import { autoUpdate, flip, offset, shift } from "@floating-ui/dom";

import { Keybind, KeybindAction } from "@revolt/keybinds";

import { FloatingElement, floatingElements } from "../../directives";

import { dismissFloatingElements } from ".";
import { AutoComplete } from "./AutoComplete";
import { TooltipBase } from "./Tooltip";
import { UserCard } from "./UserCard";

/**
 * Render the actual floating elements
 */
export function FloatingManager() {
  let mouseX = 0,
    mouseY = 0;

  /**
   * Keep track of last mouse position at all times
   */
  function onMouseMove({ clientX, clientY }: MouseEvent) {
    mouseX = clientX;
    mouseY = clientY;
  }

  onMount(() => document.addEventListener("mousemove", onMouseMove));
  onCleanup(() => document.addEventListener("mousemove", onMouseMove));

  /**
   * Whether a floating element is visible
   */
  function anyVisible() {
    return floatingElements().find((el) => el.show());
  }

  return (
    <Portal mount={document.getElementById("floating")!}>
      <For each={floatingElements()}>
        {(element) => (
          <Presence>
            <Show when={element.show()}>
              <Floating {...element} mouseX={mouseX} mouseY={mouseY} />
            </Show>
          </Presence>
        )}
      </For>

      <Show when={anyVisible()}>
        <Keybind
          keybind={KeybindAction.CLOSE_FLOATING}
          onPressed={dismissFloatingElements}
        />
      </Show>
    </Portal>
  );
}

/**
 * Render a floating element
 */
function Floating(props: FloatingElement & { mouseX: number; mouseY: number }) {
  const [floating, setFloating] = createSignal<HTMLDivElement>();

  /**
   * Figure out placement of the floating element
   */
  const placement = () => {
    const current = props.show();
    if (!current) return;

    if (current.tooltip) {
      return current.tooltip.placement;
    } else if (current.userCard) {
      return "right-start";
    } else if (current.contextMenu) {
      return "right-start";
    } else if (current.autoComplete) {
      return "top-start";
    }
  };

  /**
   * Determine element to provide
   */
  const element = () => {
    const current = props.show();

    if (current?.contextMenu) {
      return {
        /**
         * Determine client rectangle for virtual element
         */
        getBoundingClientRect() {
          return {
            width: 0,
            height: 0,
            x: props.mouseX,
            y: props.mouseY,
            left: props.mouseX,
            right: props.mouseX,
            top: props.mouseY,
            bottom: props.mouseY,
          };
        },
      };
    } else {
      return props.element;
    }
  };

  const position = useFloating(element, floating, {
    placement: placement(),
    middleware: [offset(5), flip(), shift()],
    whileElementsMounted:
      props.show()?.tooltip || props.show()?.autoComplete
        ? autoUpdate
        : undefined,
  });

  /**
   * Handle page clicks outside of floating element
   * @param event Event
   */
  function onMouseDown(event: MouseEvent) {
    const currentlyShown = props.show();
    if (!currentlyShown?.contextMenu && !currentlyShown?.userCard) return;

    // Check if we've clicked inside of the user card / context menu
    const parentEl = floating();

    let currentEl = event.target as HTMLElement | null;
    while (currentEl && currentEl !== parentEl) {
      currentEl = currentEl.parentElement;
    }

    if (currentEl === null) {
      // If we're operating in card mode, don't hide yet if we click on the context menu
      // jank alert!
      if (currentlyShown.userCard) {
        const targetEl = document.querySelector(".UserContextMenu");

        if (targetEl) {
          let currentEl = event.target as HTMLElement | null;
          while (currentEl && currentEl !== targetEl) {
            currentEl = currentEl.parentElement;
          }

          if (currentEl) return;
        }
      }

      props.hide();
    }
  }

  if (props.config().contextMenu || props.config().userCard) {
    onMount(() => document.addEventListener("mousedown", onMouseDown));
    onCleanup(() => document.removeEventListener("mousedown", onMouseDown));
  }

  /**
   * Jank catcher 9000
   * @param event Event
   */
  function onMouseUp(event: MouseEvent) {
    const currentlyShown = props.show();
    if (!currentlyShown?.userCard) return;

    // Check if we've clicked inside of the user card
    const parentEl = floating();

    let currentEl = event.target as HTMLElement | null;
    while (currentEl && currentEl !== parentEl) {
      currentEl = currentEl.parentElement;
    }

    if (currentEl === null) {
      props.hide();
    }
  }

  if (props.config().userCard) {
    onMount(() =>
      setTimeout(() => document.addEventListener("click", onMouseUp), 0),
    );
    onCleanup(() => document.removeEventListener("click", onMouseUp));
  }

  /**
   * Always dismiss context menu on click
   */
  function onClick() {
    const currentlyShown = props.show();
    if (!currentlyShown?.contextMenu) return;

    props.hide();
  }

  if (props.config().contextMenu) {
    onMount(() => document.addEventListener("click", onClick));
    onCleanup(() => document.removeEventListener("click", onClick));
  }

  return (
    <Motion
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.1, easing: [0.87, 0, 0.13, 1] }}
    >
      <div
        ref={setFloating}
        style={{
          position: position.strategy,
          top: `${position.y ?? 0}px`,
          left: `${position.x ?? 0}px`,
          "z-index": "999",
        }}
      >
        <Switch>
          <Match when={props.show()?.tooltip}>
            <TooltipBase>
              {typeof props.show()!.tooltip!.content === "function"
                ? (props.show()!.tooltip!.content as Function)({})
                : props.show()!.tooltip!.content}
            </TooltipBase>
          </Match>
          <Match when={props.show()?.userCard}>
            <UserCard
              user={props.show()!.userCard!.user}
              member={props.show()!.userCard!.member}
              onClose={props.hide}
            />
          </Match>
          <Match when={props.show()?.contextMenu}>
            {props.show()!.contextMenu!({})}
          </Match>
          <Match when={props.show()?.autoComplete}>
            <AutoComplete {...props.show()!.autoComplete!} />
          </Match>
        </Switch>
      </div>
    </Motion>
  );
}
