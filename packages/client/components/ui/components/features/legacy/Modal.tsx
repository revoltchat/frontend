import { ComponentProps, For, JSX, Show } from "solid-js";
import { Portal } from "solid-js/web";
import { Motion, Presence } from "solid-motionone";

import { styled } from "styled-system/jsx";

import { Button, Text } from "../../design";

export type Action = Omit<ComponentProps<typeof Button>, "onClick"> & {
  confirmation?: boolean;
  onClick: () => void | boolean | Promise<boolean>;
};

interface Props {
  /**
   * Given content padding
   */
  padding?: string;

  /**
   * Maximum width of the modal
   */
  maxWidth?: string;

  /**
   * Maximum height of the modal
   */
  maxHeight?: string;

  /**
   * Whether inputs should be disabled
   */
  disabled?: boolean;

  /**
   * Whether the modal should be transparent
   */
  transparent?: boolean;

  /**
   * Whether the modal should not be dismissable by clicking the empty area
   */
  nonDismissable?: boolean;

  /**
   * Actions to show at the bottom of the modal
   */
  actions?: Action[] | (() => Action[]);

  /**
   * Whether to show the modal
   */
  show?: boolean;

  /**
   * Callback when modal is closed
   */
  onClose?: () => void;

  /**
   * Modal title
   */
  title?: JSX.Element;

  /**
   * Modal description
   */
  description?: JSX.Element;

  /**
   * Modal content
   */
  children?: JSX.Element;
}

/**
 * Fixed position container to centre the modal
 */
const Base = styled("div", {
  base: {
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    position: "fixed",
    zIndex: "100",
    maxHeight: "100%",
    userSelect: "none",
    animationDuration: "0.2s",
    animationFillMode: "forwards",
    display: "grid",
    overflowY: "auto",
    placeItems: "center",
    transition: "var(--transitions-medium) all",
    pointerEvents: "none",
    background: "transparent",
  },
  variants: {
    show: {
      true: {
        pointerEvents: "all",
        background: "rgba(0, 0, 0, 0.6)",
      },
    },
  },
  defaultVariants: {
    show: true,
  },
});

/**
 * Component that wraps all of the actual modal content
 */
const Container = styled("div", {
  base: {
    width: "unset",
    maxWidth: "min(calc(100vw - 20px), 450px)",
    maxHeight: "min(calc(100vh - 20px), 650px)",
    margin: "20px",
    display: "flex",
    flexDirection: "column",
    color: "var(--colours-component-modal-foreground)",
    background: "var(--colours-component-modal-background)",
    borderRadius: "var(--borderRadius-lg)",
    overflow: "hidden",
  },
  variants: {
    transparent: {
      true: {
        background: "transparent",
        borderRadius: "none",
        overflow: "unset",
      },
    },
  },
});

/**
 * Container for the title elements
 */
const Title = styled("div", {
  base: {
    padding: "1rem",
    flexShrink: 0,
    wordBreak: "break-word",
    gap: "8px",
    display: "flex",
    flexDirection: "column",
  },
});

/**
 * Container for the given content
 */
const Content = styled("div", {
  base: {
    flexGrow: 1,
    paddingTop: 0,
    padding: "0 1rem 1rem",
    overflowY: "auto",
    fontSize: "0.9375rem",
    display: "flex",
    flexDirection: "column",
  },
});

/**
 * Container for bottom modal actions
 */
const Actions = styled("div", {
  base: {
    flexShrink: 0,
    gap: "8px",
    display: "flex",
    padding: "0 1rem 1rem 1rem",
    flexDirection: "row-reverse",
  },
});

/**
 * Modal component
 *
 * This component mounts itself to the body.
 *
 * @deprecated use Dialog instead
 */
export function Modal(props: Props) {
  const showActions = () =>
    typeof props.actions === "function" ||
    (props.actions ? props.actions.length > 0 : false);

  return (
    <Portal mount={document.getElementById("floating")!}>
      <Base
        show={props.show}
        onClick={() => !props.nonDismissable && props.onClose?.()}
      >
        <Presence>
          <Show when={props.show}>
            <Motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, easing: [0.22, 0.54, 0.41, 1.46] }}
            >
              <Container
                onClick={(e) => e.stopPropagation()}
                transparent={props.transparent}
                style={{
                  width: props.maxWidth ? "100%" : "unset",
                  "max-width": `min(calc(100vw - 20px), ${
                    props.maxWidth ?? "450px"
                  })`,
                  "max-height": `min(calc(100vh - 20px), ${
                    props.maxHeight ?? "650px"
                  })`,
                }}
              >
                <Show when={props.title || props.description}>
                  <Title>
                    <Show when={props.title}>
                      <Text class="headline" size="small">
                        {props.title}
                      </Text>
                    </Show>
                    <Show when={props.description}>
                      <Text class="body" size="medium">
                        {props.description}
                      </Text>
                    </Show>
                  </Title>
                </Show>
                <Show when={props.children}>
                  <Content>{props.children}</Content>
                </Show>
                <Show when={showActions()}>
                  <Actions>
                    <For
                      each={
                        typeof props.actions === "function"
                          ? props.actions()
                          : props.actions
                      }
                    >
                      {(action) => (
                        <Button
                          {...action}
                          {...{ onClick: () => void 0 }} // HACK: prevent onClick from being
                          // Modal2 doesn't have this issue :)
                          isDisabled={props.disabled}
                          // eslint-disable-next-line
                          onPress={async () => {
                            if (await action.onClick()) {
                              props.onClose?.();
                            }
                          }}
                        />
                      )}
                    </For>
                  </Actions>
                </Show>
              </Container>
            </Motion.div>
          </Show>
        </Presence>
      </Base>
    </Portal>
  );
}
