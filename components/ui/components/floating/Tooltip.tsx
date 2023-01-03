import { useFloating } from "solid-floating-ui";
import { styled } from "solid-styled-components";
import { createSignal, JSX, Ref, Show } from "solid-js";
import { autoUpdate, flip, offset, Placement, shift } from "@floating-ui/dom";
import { Motion, Presence } from "@motionone/solid";

/**
 * Base element for the tooltip
 */
const TooltipBase = styled("div", "Tooltip")`
  color: white;
  background: black;

  font-size: ${(props) => props.theme!.typography.tooltip.fontSize};
  font-weight: ${(props) => props.theme!.typography.tooltip.fontWeight};

  padding: ${(props) => props.theme!.gap.md};
  border-radius: ${(props) => props.theme!.borderRadius.md};
`;

interface Props {
  /**
   * Tooltip trigger area
   * @param triggerProps Props that need to be applied to the trigger area
   */
  children: (triggerProps: {
    ref: Ref<any>;
    onClick: JSX.EventHandlerUnion<HTMLElement, MouseEvent>;
    onMouseEnter: JSX.EventHandlerUnion<HTMLElement, MouseEvent>;
    onMouseLeave: JSX.EventHandlerUnion<HTMLElement, MouseEvent>;
  }) => JSX.Element;

  /**
   * Placement of the tooltip
   */
  placement?: Placement;

  /**
   * Initial tooltip state (used for debugging)
   */
  initialState?: boolean;

  /**
   * Content of the tooltip
   */
  content: JSX.Element;
}

/**
 * Tooltip component
 */
export function Tooltip(props: Props) {
  // for arrows: const id = crypto.randomUUID();
  const [anchor, setAnchor] = createSignal<HTMLElement>();
  const [floating, setFloating] = createSignal<HTMLDivElement>();
  const [show, setShow] = createSignal(props.initialState ?? false);

  const position = useFloating(anchor, floating, {
    placement: props.placement,
    whileElementsMounted: autoUpdate,
    middleware: [offset(5), flip(), shift()],
  });

  return (
    <>
      {props.children({
        ref: setAnchor,
        onClick: () => setShow(false),
        onMouseEnter: () => setShow(true),
        onMouseLeave: () => setShow(false),
      })}
      <Presence>
        <Show when={show()}>
          <Motion
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1, easing: [0.87, 0, 0.13, 1] }}
          >
            <TooltipBase
              ref={setFloating}
              style={{
                position: position.strategy,
                top: `${position.y ?? 0}px`,
                left: `${position.x ?? 0}px`,
              }}
              role="tooltip"
            >
              {props.content}
            </TooltipBase>
          </Motion>
        </Show>
      </Presence>
    </>
  );
}
