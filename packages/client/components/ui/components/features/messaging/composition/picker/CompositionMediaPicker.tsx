import { useFloating } from "solid-floating-ui";
import { Match, Switch, createSignal } from "solid-js";
import { JSX, Ref, Show } from "solid-js";
import { Portal } from "solid-js/web";
import { Motion, Presence } from "solid-motionone";

import { autoUpdate, flip, offset, shift } from "@floating-ui/dom";
import { cva } from "styled-system/css";
import { styled } from "styled-system/jsx";

import { Button } from "@revolt/ui/components/design";
import { Row } from "@revolt/ui/components/layout";

import { EmojiPicker } from "./EmojiPicker";

interface Props {
  /**
   * User card trigger area
   * @param triggerProps Props that need to be applied to the trigger area
   */
  children: (triggerProps: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: Ref<any>;
    onClickGif: () => void;
    onClickEmoji: () => void;
  }) => JSX.Element;

  /**
   * Send a message
   */
  sendGIFMessage: (content: string) => void;
}

export function CompositionMediaPicker(props: Props) {
  const [anchor, setAnchor] = createSignal<HTMLElement>();
  const [floating, setFloating] = createSignal<HTMLDivElement>();
  const [show, setShow] = createSignal<"gif" | "emoji">();

  const position = useFloating(anchor, floating, {
    placement: "top-end",
    whileElementsMounted: autoUpdate,
    middleware: [offset(5), flip(), shift()],
  });

  return (
    <>
      {props.children({
        ref: setAnchor,
        onClickGif: () =>
          setShow((current) => (current === "gif" ? undefined : "gif")),
        onClickEmoji: () =>
          setShow((current) => (current === "emoji" ? undefined : "emoji")),
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
                <Container>
                  <Row justify>
                    <Button
                      variant={show() === "gif" ? "filled" : "tonal"}
                      shape={show() === "gif" ? "round" : "square"}
                      onPress={() => setShow("gif")}
                      group="connected-start"
                    >
                      GIFs
                    </Button>
                    <Button
                      variant={show() === "emoji" ? "filled" : "tonal"}
                      shape={show() === "emoji" ? "round" : "square"}
                      onPress={() => setShow("emoji")}
                      group="connected-end"
                    >
                      Emoji
                    </Button>
                  </Row>

                  <Switch>
                    <Match when={show() === "emoji"}>
                      <EmojiPicker />
                    </Match>
                  </Switch>
                </Container>
              </Base>
            </Motion>
          </Show>
        </Presence>
      </Portal>
    </>
  );
}

/**
 * Base element
 */
const Base = styled("div", {
  base: {
    width: "400px",
    height: "400px",
    // paddingInlineEnd: "5px",
  },
});

/**
 * Container element for the picker
 */
const Container = styled("div", {
  base: {
    width: "100%",
    height: "100%",

    display: "flex",
    flexDirection: "column",

    alignItems: "stretch",

    padding: "var(--gap-md) 0",
    overflow: "hidden",
    borderRadius: "var(--borderRadius-lg)",
    color: "var(--md-sys-color-on-surface)",
    fill: "var(--md-sys-color-on-surface)",
    boxShadow: "0 0 3px var(--md-sys-color-shadow)",
    background: "var(--md-sys-color-surface-container)",
  },
});

/**
 * Styles for the content container
 */
export const compositionContent = cva({
  base: {
    flexGrow: 1,
    minHeight: 0,
  },
});
