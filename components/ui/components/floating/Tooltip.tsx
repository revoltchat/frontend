import { useFloating } from "solid-floating-ui";
import { JSX, Ref, Show, createSignal } from "solid-js";
import { Portal } from "solid-js/web";
import { styled } from "solid-styled-components";

import { Placement, autoUpdate, flip, offset, shift } from "@floating-ui/dom";
import { Motion, Presence } from "@motionone/solid";

import { generateTypographyCSS } from "../design/atoms/display/Typography";

/**
 * Base element for the tooltip
 */
const TooltipBase = styled("div", "Tooltip")`
  color: white;
  background: black;
  ${(props) => generateTypographyCSS(props.theme!, "tooltip")};

  padding: ${(props) => props.theme!.gap.md};
  border-radius: ${(props) => props.theme!.borderRadius.md};
`;

interface Props {
  /**
   * Tooltip trigger area
   * @param triggerProps Props that need to be applied to the trigger area
   */
  children: (triggerProps: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: Ref<any>;
    onClick: JSX.EventHandlerUnion<HTMLElement | SVGElement, MouseEvent>;
    onMouseEnter: JSX.EventHandlerUnion<HTMLElement | SVGElement, MouseEvent>;
    onMouseLeave: JSX.EventHandlerUnion<HTMLElement | SVGElement, MouseEvent>;
    "aria-label"?: string;
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

  /**
   * Copy content to aria label field
   * **Must be a string!**
   */
  aria?: boolean;
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
        "aria-label": props.aria ? (props.content as string) : undefined,
      })}
      <Portal mount={document.getElementById("floating")!}>
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
      </Portal>
    </>
  );
}
