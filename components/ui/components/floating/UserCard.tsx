import { useFloating } from "solid-floating-ui";
import { For, JSX, Ref, Show, createSignal } from "solid-js";
import { Portal } from "solid-js/web";
import { styled } from "solid-styled-components";

import { autoUpdate, flip, offset, shift } from "@floating-ui/dom";
import { Motion, Presence } from "@motionone/solid";
import { Member, User } from "revolt.js";

import { ColouredText } from "../design";

/**
 * Base element for the card
 */
const Base = styled("div", "Tooltip")`
  color: white;
  background: black;
  width: 400px;
  height: 400px;
`;

interface Props {
  /**
   * User card trigger area
   * @param triggerProps Props that need to be applied to the trigger area
   */
  children: (triggerProps: {
    ref: Ref<any>;
    onClick: JSX.EventHandlerUnion<HTMLElement, MouseEvent>;
  }) => JSX.Element;

  /**
   * Initial show state (used for debugging)
   */
  initialState?: boolean;

  /**
   * User to show
   */
  user: User;

  /**
   * Member to show
   */
  member?: Member;
}

/**
 * UserCard component
 */
export function UserCard(props: Props) {
  const [anchor, setAnchor] = createSignal<HTMLElement>();
  const [floating, setFloating] = createSignal<HTMLDivElement>();
  const [show, setShow] = createSignal(props.initialState ?? false);

  const position = useFloating(anchor, floating, {
    placement: "right-start",
    whileElementsMounted: autoUpdate,
    middleware: [offset(5), flip(), shift()],
  });

  return (
    <>
      {props.children({
        ref: setAnchor,
        onClick: () => setShow(!show()),
      })}
      <Portal mount={document.getElementById("floating")!}>
        <Presence>
          <Show when={show()}>
            <Motion
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, easing: [0.87, 0, 0.13, 1] }}
            >
              <Base
                ref={setFloating}
                style={{
                  position: position.strategy,
                  top: `${position.y ?? 0}px`,
                  left: `${position.x ?? 0}px`,
                }}
                role="tooltip"
              >
                {props.user.username}
                <br />
                <Show when={props.member}>
                  <For each={props.member!.orderedRoles}>
                    {([, role]) => (
                      <div>
                        <ColouredText
                          colour={role.colour!}
                          clip={role.colour?.includes("gradient")}
                        >
                          {role.name}
                        </ColouredText>
                      </div>
                    )}
                  </For>
                </Show>
              </Base>
            </Motion>
          </Show>
        </Presence>
      </Portal>
    </>
  );
}
